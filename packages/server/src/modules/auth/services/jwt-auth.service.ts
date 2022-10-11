import { Injectable } from '@nestjs/common';
import { UsersService, User, RefreshToken } from '../../users';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { addMilliSeconds } from '@lyvely/common';
import ms from 'ms';
import { ConfigurationPath } from '@/modules/app-config';
import { JwtSignOptions } from '@nestjs/jwt/dist/interfaces';
import { JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN } from '../guards';

@Injectable()
export class JwtAuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService<ConfigurationPath>,
  ) {}

  async login(user: User, remember?: boolean) {
    const vid = uuidv4();
    return {
      accessToken: this.createAccessToken(user),
      refreshToken: await this.createRefreshToken(user, vid, remember),
      vid: vid,
    };
  }

  public createAccessToken(user: User): string {
    const options = {
      secret: this.configService.get('auth.jwt.access.secret'),
      expiresIn: this.configService.get('auth.jwt.access.expiresIn'),
      algorithm: 'HS256',
    } as JwtSignOptions;

    const issuer = this.configService.get('auth.jwt.issuer');
    if (issuer) options.issuer = issuer;

    return this.jwtService.sign({ sub: user._id.toString(), purpose: JWT_ACCESS_TOKEN }, options);
  }

  public async createRefreshToken(user: User, visitorId: string, remember?: boolean): Promise<string> {
    remember = !!remember;
    const expiresIn = remember
      ? this.configService.get('auth.jwt.refresh.expiresInRemember')
      : this.configService.get('auth.jwt.refresh.expiresIn');

    const options = {
      secret: this.configService.get('auth.jwt.refresh.secret'),
      expiresIn: expiresIn,
      algorithm: 'HS256',
    } as JwtSignOptions;

    const issuer = this.configService.get('auth.jwt.issuer');
    if (issuer) options.issuer = issuer;

    const token = this.jwtService.sign(
      {
        sub: user._id.toString(),
        purpose: JWT_REFRESH_TOKEN,
        remember: remember,
      },
      options,
    );

    // TODO: there should be a limit of refresh tokens...
    await this.setVisitorRefreshToken(
      user,
      visitorId,
      token,
      addMilliSeconds(new Date(), ms(this.configService.get('auth.jwt.refresh.expiresIn')), false),
      remember,
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
    remember: boolean,
  ) {
    return this.usersService.setRefreshToken(
      user,
      new RefreshToken({
        vid: visitorId,
        hash: await bcrypt.hash(token, 10),
        expiration: expiration,
        remember: remember,
      }),
    );
  }
}
