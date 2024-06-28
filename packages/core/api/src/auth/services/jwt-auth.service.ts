import { Injectable } from '@nestjs/common';
import { UsersService, User, RefreshToken } from '@/users';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { addMilliSeconds } from '@lyvely/dates';
import ms from 'ms';
import { JwtSignOptions } from '@nestjs/jwt/dist/interfaces';
import { getRefreshCookieExpiresIn, JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN } from '../guards';
import { LyvelyConfigService } from '@/config';
import type { AuthModuleConfig } from '@/core';
import { DEFAULT_ACCESS_TOKEN_EXPIRES_IN } from '@/auth/auth.constants';

@Injectable()
export class JwtAuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: LyvelyConfigService<AuthModuleConfig>
  ) {}

  async login(user: User, remember: boolean) {
    const vid = uuidv4();
    return {
      accessToken: this.createAccessToken(user),
      refreshToken: await this.createRefreshToken(user, vid, remember),
      vid: vid,
    };
  }

  public createAccessToken(user: User): string {
    const options = {
      secret: this.configService.getModuleConfigOrThrow('auth', 'jwt.access.secret'),
      expiresIn: this.configService.getModuleConfig(
        'auth',
        'jwt.access.expiresIn',
        DEFAULT_ACCESS_TOKEN_EXPIRES_IN
      ),
      algorithm: 'HS256',
    } as JwtSignOptions;

    const issuer = this.configService.getModuleConfig('auth', 'jwt.issuer');
    if (issuer) options.issuer = issuer;

    return this.jwtService.sign({ sub: user._id.toString(), purpose: JWT_ACCESS_TOKEN }, options);
  }

  public async createRefreshToken(
    user: User,
    visitorId: string,
    remember: boolean
  ): Promise<string> {
    const expiresIn = getRefreshCookieExpiresIn(remember, this.configService);

    const options = {
      secret: this.configService.getModuleConfigOrThrow('auth', 'jwt.refresh.secret'),
      expiresIn: expiresIn,
      algorithm: 'HS256',
    } as JwtSignOptions;

    const issuer = this.configService.getModuleConfig('auth', 'jwt.issuer');
    if (issuer) options.issuer = issuer;

    const token = this.jwtService.sign(
      {
        sub: user._id.toString(),
        purpose: JWT_REFRESH_TOKEN,
        remember: remember,
      },
      options
    );

    // TODO: there should be a limit of refresh tokens...
    await this.setVisitorRefreshToken(
      user,
      visitorId,
      token,
      addMilliSeconds(new Date(), ms(expiresIn!)),
      remember
    );

    return token;
  }

  public async destroyRefreshToken(user: User, visitorId: string) {
    return this.usersService.destroyRefreshToken(user, visitorId);
  }

  private async setVisitorRefreshToken(
    user: User,
    visitorId: string,
    token: string,
    expiration: Date,
    remember: boolean
  ) {
    return this.usersService.setRefreshToken(
      user,
      new RefreshToken({
        vid: visitorId,
        hash: await bcrypt.hash(token, 10),
        expiration: expiration,
        remember: remember,
      })
    );
  }

  public async invalidateExpiredRefreshTokens(user: User) {
    return this.usersService.destroyExpiredRefreshTokens(user);
  }
}
