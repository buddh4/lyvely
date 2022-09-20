import { Injectable } from '@nestjs/common';
import { UsersService, User, RefreshToken } from '../../users';
import { JwtService } from '@nestjs/jwt';
import { JwtAccessTokenPayload, JwtRefreshTokenPayload } from '../strategies';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { addMilliSeconds } from '@lyvely/common';
import ms from 'ms';
import { LyvelyConfigurationGetter } from "../../../core";

// https://stackoverflow.com/questions/38897514/what-to-store-in-a-jwt

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService<LyvelyConfigurationGetter>
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findUserByUsername(username);
    if (!user) {
      return false;
    }

    return (await user.validatePassword(pass)) ? user : false;
  }

  async login(user: User) {
    const vid = uuidv4();
    return {
      accessToken: this.createAccessToken(user),
      refreshToken: await this.createRefreshToken(user, vid),
      vid: vid
    }
  }

  public createAccessToken(user: User): string {
    return this.jwtService.sign({ sub: user._id.toString() }, {
      secret: this.configService.get('auth.jwt.access.secret'),
      expiresIn: this.configService.get('auth.jwt.access.expiration')
    });
  }

  public async createRefreshToken(user: User, visitorId: string): Promise<string> {
    const token = this.jwtService.sign({ sub: user._id.toString() },{
      secret: this.configService.get('auth.jwt.refresh.secret'),
      expiresIn: this.configService.get('auth.jwt.refresh.expiration')
    });

    const expiration = addMilliSeconds(new Date(), ms(this.configService.get('auth.jwt.refresh.expiration')), false);

    // TODO: there should be a limit of refresh tokens...
    await this.setVisitorRefreshToken(user, visitorId, token, expiration);

    return token;
  }

  public async destroyRefreshToken(user: User, visitorId: string) {
    return this.usersService.destroyRefreshToken(user, visitorId);
  }

  private async setVisitorRefreshToken(user: User, visitorId: string, token: string, expiration: Date) {
    return this.usersService.setVisitorRefreshTokenHash(user, visitorId, new RefreshToken({
      vid: visitorId,
      hash: await bcrypt.hash(token, 10),
      expiration: expiration
    }));
  }

  async validateUserByJwtAccessToken(payload: JwtAccessTokenPayload): Promise<User|null> {
    return await this.usersService.findUserById(payload.sub);
  }

  async validateUserByJwtRefreshToken(tokenString: string, visitorId: string, payload: JwtRefreshTokenPayload): Promise<User|null> {
    if(!tokenString || !visitorId) {
      return null;
    }

    const user = await this.usersService.findUserById(payload.sub);

    if (!user) {
      return null;
    }

    const refreshTokenItem = user.getRefreshTokenByVisitorId(visitorId);

    if(!refreshTokenItem) {
      return null;
    }

    const isRefreshTokenMatching = await bcrypt.compare(tokenString, refreshTokenItem.hash);

    return isRefreshTokenMatching ? user : null;
  }
}
