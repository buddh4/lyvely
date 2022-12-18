import {
  Controller,
  Req,
  Post,
  UseGuards,
  Get,
  Inject,
  UnauthorizedException,
  Body,
} from '@nestjs/common';
import {
  LocalAuthGuard,
  JwtRefreshGuard,
  clearAccessCookies,
  clearRefreshCookies,
} from '../guards';
import { JwtAuthService } from '@/auth/services';
import { UserRequest, UserThrottle, UserThrottlerGuard } from '@/users';
import {
  UserModel,
  Headers,
  ENDPOINT_AUTH,
  AuthEndpoint,
  LoginModel,
  UserStatus,
} from '@lyvely/common';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { ModuleMeta, Public, UseClassSerializer, ConfigurationPath } from '@/core';
import { AbstractJwtAuthController } from '@/auth/controllers/abstract-jwt-auth.controller';
import { EmailBodyThrottlerGuard } from '@/auth/guards/email-body-throttler.guard';

@Controller(ENDPOINT_AUTH)
@UseClassSerializer()
export class AuthController extends AbstractJwtAuthController implements AuthEndpoint {
  constructor(
    private authService: JwtAuthService,
    protected configService: ConfigService<ConfigurationPath>,
    @Inject('modules.auth.meta') private meta: ModuleMeta,
  ) {
    super(configService);
  }

  @Public()
  @UseGuards(EmailBodyThrottlerGuard, LocalAuthGuard)
  @Post('login')
  async login(@Body() loginModel: LoginModel, @Req() req: UserRequest) {
    const { user } = req;
    const { accessToken, refreshToken, vid } = await this.authService.login(
      user,
      loginModel.remember,
    );

    if (user.status === UserStatus.EmailVerification) {
      throw new UnauthorizedException({ userStatus: UserStatus.EmailVerification });
    }

    await this.authService.invalidateExpiredRefreshTokens(user);

    this.setAuthenticationCookie(req, accessToken);
    this.setRefreshCookie(req, refreshToken, loginModel.remember);

    return {
      user: new UserModel(user),
      vid: vid,
      token_expiration: ms(this.configService.get<string>('auth.jwt.access.expiresIn')),
    };
  }

  @Public()
  @UseGuards(UserThrottlerGuard, JwtRefreshGuard)
  @UserThrottle(6, 60)
  @Post('refresh')
  async refresh(@Req() req: UserRequest) {
    const { user } = req;
    const vid = this.getVisitorIdHeader(req);
    const oldRefreshToken = user.getRefreshTokenByVisitorId(vid);

    if (!user || !vid) {
      // Should not happen since we validate everything in the guard, but does not hurt...
      throw new UnauthorizedException();
    }
    const newAccessToken = this.authService.createAccessToken(user);
    this.setAuthenticationCookie(req, newAccessToken);

    // Here we also refresh the refresh token itself, this allows shorter refresh token expirations
    await this.authService.destroyRefreshToken(user, oldRefreshToken.vid);
    this.setRefreshCookie(
      req,
      await this.authService.createRefreshToken(user, vid, oldRefreshToken.remember),
      oldRefreshToken.remember,
    );

    return { token_expiration: ms(this.configService.get<string>('auth.jwt.access.expiresIn')) };
  }

  @Public()
  @Post('logout')
  async logout(@Req() req: UserRequest) {
    const { user, res } = req;
    const vid = this.getVisitorIdHeader(req);
    if (user && vid) {
      await this.authService.destroyRefreshToken(user, vid);
    }
    clearAccessCookies(res);
    clearRefreshCookies(res);
    req.user = undefined;
    // TODO: trigger event
    //req.logout();
  }

  getVisitorIdHeader(req: UserRequest): string {
    const vid: string | string[] = req.header(Headers.X_VISITOR_ID);
    return Array.isArray(vid) ? vid[0] : vid;
  }

  @Get('user')
  @UseGuards(UserThrottlerGuard)
  @UserThrottle(30, 60)
  async loadUser(@Req() req: UserRequest) {
    return {
      user: new UserModel(req.user),
      token_expiration: ms(this.configService.get<string>('auth.jwt.access.expiresIn')),
    };
  }
}
