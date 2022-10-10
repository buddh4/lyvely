import { Controller, Req, Post, UseGuards, Get, Inject, UnauthorizedException, Body } from '@nestjs/common';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { JwtAuthService } from '../services/jwt-auth.service';
import { UserRequest } from '../../users';
import { addMilliSeconds, UserModel, Headers, ENDPOINT_AUTH, AuthEndpoint, LoginModel } from '@lyvely/common';
import { Cookies } from '../../core/web';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import JwtRefreshGuard from '../guards/jwt-refresh.guard';
import { MailService } from '@/modules/mails';
import { ModuleMeta, Public, UseClassSerializer } from '@/modules/core';
import { ConfigurationPath } from '@/modules/app-config';
import { JwtStrategy } from '@/modules/auth/strategies';

@Controller(ENDPOINT_AUTH)
@UseClassSerializer()
export class AuthController implements AuthEndpoint {
  constructor(
    private authService: JwtAuthService,
    private configService: ConfigService<ConfigurationPath>,
    private mailerService: MailService,
    @Inject('modules.auth.meta') private meta: ModuleMeta,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginModel: LoginModel, @Req() req: UserRequest) {
    const { user } = req;
    const { accessToken, refreshToken, vid } = await this.authService.login(user, loginModel.remember);

    this.setAuthenticationCookie(req, accessToken);
    this.setRefreshCookie(req, refreshToken);

    return {
      user: new UserModel(user),
      vid: vid,
      token_expiration: ms(this.configService.get('auth.jwt.access.expiresIn')),
    };
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
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
    this.setRefreshCookie(req, await this.authService.createRefreshToken(user, vid, oldRefreshToken.remember));

    return { token_expiration: ms(this.configService.get('auth.jwt.access.expiresIn')) };
  }

  @Public()
  @Post('logout')
  async logout(@Req() req: UserRequest) {
    const { user, res } = req;
    const vid = this.getVisitorIdHeader(req);
    if (user && vid) {
      await this.authService.destroyRefreshToken(user, vid);
    }
    res.clearCookie(Cookies.REFRESH);
    res.clearCookie(Cookies.AUTHENTICATION);
    req.user = undefined;
    // TODO: trigger event
    //req.logout();
  }

  getVisitorIdHeader(req: UserRequest): string {
    const vid: string | string[] = req.header(Headers.X_VISITOR_ID);
    return Array.isArray(vid) ? vid[0] : vid;
  }

  @Get('user')
  async loadUser(@Req() req: UserRequest) {
    return {
      user: new UserModel(req.user),
      token_expiration: ms(this.configService.get('auth.jwt.access.expiresIn')),
    };
  }

  private setAuthenticationCookie(req: UserRequest, token) {
    const secure = this.useSecureCookies();
    const authCookieName = JwtStrategy.getAuthCookieName(secure);
    const expirationMS = Math.max(ms(this.configService.get('auth.jwt.access.expiresIn', '15m')), 20_000);
    req.res.cookie(authCookieName, token, {
      sameSite: this.configService.get('auth.jwt.access.samesite', 'lax'),
      httpOnly: true,
      secure: secure,
      expires: addMilliSeconds(new Date(), expirationMS, false),
    });
  }

  private setRefreshCookie(req: UserRequest, token) {
    const isSecure = this.useSecureCookies();
    const refreshCookieName = isSecure ? Cookies.REFRESH_SECURE : Cookies.REFRESH;
    req.res.cookie(refreshCookieName, token, {
      sameSite: this.configService.get('auth.jwt.refresh.samesite', 'lax'),
      httpOnly: true,
      // TODO: we need to respect api version or different api path here...
      path: '/auth/refresh',
      secure: isSecure,
      expires: addMilliSeconds(new Date(), ms(this.configService.get('auth.jwt.refresh.expiresIn')), false),
    });
  }

  private useSecureCookies() {
    return this.configService.get('auth.jwt.secure-cookies', true);
  }
}
