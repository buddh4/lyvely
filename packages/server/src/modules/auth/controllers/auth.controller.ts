import { Controller, Req, Post, UseGuards, Get, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { JwtAuthService } from '../services/jwt-auth.service';
import { Public } from '../../core';
import { UserRequest } from '../../users';
import { addMilliSeconds, UserModel, Headers } from '@lyvely/common';

import { Cookies } from '../../core/web';

import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import JwtRefreshGuard from '../guards/jwt-refresh.guard';
import { ConfigurationPath } from '../../core';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private authService: JwtAuthService, private configService: ConfigService<ConfigurationPath>) {}

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

  // TODO: Maybe move to app controller...
  @Public()
  @Get('config')
  async config(@Req() req: UserRequest) {
    return {
      csrf_token: req.csrfToken(),
    };
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  refresh(@Req() req: UserRequest) {
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
    if (user && req.header(Headers.X_VISITOR_ID)) {
      await this.authService.destroyRefreshToken(user, req.header(Headers.X_VISITOR_ID));
    }
    res.clearCookie(Cookies.REFRESH);
    res.clearCookie(Cookies.AUTHENTICATION);
    req.user = undefined;
    // TODO: trigger event
    //req.logout();
  }

  @Get('user')
  async loadUser(@Req() req: UserRequest) {
    console.log(req.csrfToken());
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
