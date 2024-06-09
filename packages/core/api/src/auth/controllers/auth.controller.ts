import { Req, Post, UseGuards, Get, UnauthorizedException, Body, Logger } from '@nestjs/common';
import {
  LocalAuthGuard,
  JwtRefreshGuard,
  clearAccessCookies,
  clearRefreshCookies,
  LoginThrottlerGuard,
} from '../guards';
import { AbstractJwtAuthController } from './abstract-jwt-auth.controller';
import { JwtAuthService } from '../services';
import {
  UserRequest,
  UserThrottle,
  UserThrottlerGuard,
  UserRoleAccess,
  UserStatusAccess,
} from '@/users';
import {
  UserStatus,
  UserModel,
  API_AUTH,
  AuthEndpoint,
  LoginModel,
  AuthEndpoints,
  Headers,
  UserRole,
} from '@lyvely/interface';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { Public, UseClassSerializer } from '@/core';
import { ConfigurationPath } from '@/config';
import { GlobalController } from '@/common';

@GlobalController(API_AUTH)
@UseClassSerializer()
export class AuthController extends AbstractJwtAuthController implements AuthEndpoint {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    private authService: JwtAuthService,
    protected override configService: ConfigService<ConfigurationPath>
  ) {
    super(configService);
  }

  @Public()
  @UseGuards(LoginThrottlerGuard, LocalAuthGuard)
  @Post(AuthEndpoints.LOGIN)
  async login(@Body() loginModel: LoginModel, @Req() req: UserRequest) {
    const { user } = req;
    loginModel.remember ??= false;
    const { accessToken, refreshToken, vid } = await this.authService.login(
      user,
      loginModel.remember
    );

    // We do not use @UserStatusAccess here, since our local auth guard will be executed after the base user guard.
    if (user.status === UserStatus.EmailVerification) {
      throw new UnauthorizedException({ userStatus: UserStatus.EmailVerification });
    }

    await this.authService.invalidateExpiredRefreshTokens(user);

    this.setAuthenticationCookie(req, accessToken);
    this.setRefreshCookie(req, refreshToken, loginModel.remember);

    return {
      user: new UserModel(user),
      vid: vid,
      token_expiration: ms(this.configService.get<string>('auth.jwt.access.expiresIn')!),
    };
  }

  @Public()
  @UseGuards(UserThrottlerGuard, JwtRefreshGuard)
  @UserThrottle(6, 60_000)
  @Post(AuthEndpoints.REFRESH)
  async refresh(@Req() req: UserRequest) {
    const { user } = req;
    const vid = this.getVisitorIdHeader(req);
    const oldRefreshToken = user.getRefreshTokenByVisitorId(vid);

    if (!user || !vid || !oldRefreshToken) {
      // Should not happen since we validate everything in the guard, but does not hurt...
      throw new UnauthorizedException();
    }
    const newAccessToken = this.authService.createAccessToken(user);
    this.setAuthenticationCookie(req, newAccessToken);

    // Here we also refresh the refresh token itself, this allows shorter refresh token expirations
    await this.authService.destroyRefreshToken(user, oldRefreshToken.vid);
    this.setRefreshCookie(
      req,
      await this.authService.createRefreshToken(user, vid, !!oldRefreshToken.remember),
      !!oldRefreshToken.remember
    );

    return { token_expiration: ms(this.configService.get<string>('auth.jwt.access.expiresIn')!) };
  }

  @Public()
  @UserStatusAccess(true)
  @Post(AuthEndpoints.LOGOUT)
  async logout(@Req() req: UserRequest) {
    const { user, res } = req;
    const vid = this.getVisitorIdHeader(req);

    try {
      if (user && vid) {
        await this.authService.destroyRefreshToken(user, vid);
      }
    } catch (e) {
      this.logger.error(e);
    }

    clearAccessCookies(res!);
    clearRefreshCookies(res!);
    req.user = undefined as any;
    // TODO: trigger event
  }

  getVisitorIdHeader(req: UserRequest): string {
    const vid = req.header(Headers.X_VISITOR_ID);
    return Array.isArray(vid) ? vid[0] : vid;
  }

  @Get(AuthEndpoints.USER)
  @UserRoleAccess(UserRole.User)
  @UseGuards(UserThrottlerGuard)
  @UserThrottle(30, 60_000)
  async loadUser(@Req() req: UserRequest) {
    return {
      user: new UserModel(req.user),
      token_expiration: ms(this.configService.get<string>('auth.jwt.access.expiresIn')!),
    };
  }
}
