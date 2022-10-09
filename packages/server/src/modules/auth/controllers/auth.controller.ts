import {
  Controller,
  Req,
  Post,
  UseGuards,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
  Inject,
} from '@nestjs/common';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { JwtAuthService } from '../services/jwt-auth.service';
import { UserRequest } from '../../users';
import { addMilliSeconds, UserModel, Headers, ENDPOINT_AUTH, AuthEndpoint } from '@lyvely/common';
import { Cookies } from '../../core/web';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import JwtRefreshGuard from '../guards/jwt-refresh.guard';
import { MailService } from '@/modules/mails';
import { ModuleMeta, Public } from '@/modules/core';
import { ConfigurationPath } from '@/modules/app-config';

@Controller(ENDPOINT_AUTH)
@UseInterceptors(ClassSerializerInterceptor)
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
  async login(@Req() req: UserRequest) {
    const { user } = req;
    const { accessToken, refreshToken, vid } = await this.authService.login(user);
    this.setAuthenticationCookie(req, accessToken);
    this.setRefreshCookie(req, refreshToken);

    return {
      user: new UserModel(user),
      vid: vid,
      token_expiration: ms(this.configService.get('auth.jwt.access.expiration')),
    };
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refresh(@Req() req: UserRequest) {
    const newAccessCookie = this.authService.createAccessToken(req.user);
    this.setAuthenticationCookie(req, newAccessCookie);

    //TODO: here we could invalidate the old refresh token and return a new one

    return {
      token_expiration: ms(this.configService.get('auth.jwt.access.expiration')),
    };
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
      token_expiration: ms(this.configService.get('auth.jwt.access.expiration')),
    };
  }

  private setAuthenticationCookie(req: UserRequest, token) {
    req.res.cookie(Cookies.AUTHENTICATION, token, {
      sameSite: this.configService.get('auth.jwt.access.samesite', 'lax'),
      httpOnly: true,
      secure: this.configService.get('auth.jwt.secure-cookies', true),
      expires: addMilliSeconds(new Date(), ms(this.configService.get('auth.jwt.access.expiration')), false),
    });
  }

  private setRefreshCookie(req: UserRequest, token) {
    req.res.cookie(Cookies.REFRESH, token, {
      sameSite: this.configService.get('auth.jwt.refresh.samesite', 'lax'),
      httpOnly: true,
      // TODO: we need to respect api version or different api path here...
      path: '/auth/refresh',
      secure: this.configService.get('auth.jwt.secure-cookies', true),
      expires: addMilliSeconds(new Date(), ms(this.configService.get('auth.jwt.refresh.expiration')), false),
    });
  }
}
