import {
  Controller,
  Req,
  Post,
  UseGuards,
  Get,
  UseInterceptors, ClassSerializerInterceptor
} from '@nestjs/common';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { AuthService } from '../services/auth.service';
import { Public } from '../decorators/public.decorator';
import { UserRequest } from '../../core/types';
import { addMilliSeconds , UserDto , Headers } from 'lyvely-common';

import { Cookies } from '../../core/web';

import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import JwtRefreshGuard from '../guards/jwt-refresh.guard';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private authService: AuthService, private configService: ConfigService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: UserRequest) {
    const { user } = req;
    const { accessToken, refreshToken, vid  } = await this.authService.login(user);
    this.setAuthenticationCookie(req, accessToken);
    this.setRefreshCookie(req, refreshToken);

    return {
      user: new UserDto(user),
      vid: vid,
      token_expiration: ms(this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'))
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
      token_expiration: ms(this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'))
    };
  }

  @Post('logout')
  async logout(@Req() req: UserRequest) {
    const { user, res } = req;
    if(req.header(Headers.X_VISITOR_ID)) {
      await this.authService.destroyRefreshToken(user, req.header(Headers.X_VISITOR_ID))
    }
    res.clearCookie(Cookies.REFRESH);
    res.clearCookie(Cookies.AUTHENTICATION);
    req.logout();
  }

  @Get('user')
  async loadUser(@Req() req: UserRequest) {
    return {
      user: new UserDto(req.user),
      token_expiration: ms(this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'))
    };
  }

  private setAuthenticationCookie(req: UserRequest, token) {
    req.res.cookie( Cookies.AUTHENTICATION, token, {
      sameSite: this.configService.get('JWT_ACCESS_COOKIE_SAMESITE', 'lax'),
      httpOnly: true,
      secure: this.configService.get('JWT_COOKIES_SECURE', true),
      expires: addMilliSeconds(new Date(), ms(this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')), false)
    });
  }

  private setRefreshCookie(req: UserRequest, token) {
    req.res.cookie( Cookies.REFRESH, token, {
      sameSite: this.configService.get('JWT_REFRESH_COOKIE_SAMESITE', 'lax'),
      httpOnly: true,
      // TODO: we need to respect api version or different api path here...
      path: '/auth/refresh',
      secure: this.configService.get('JWT_COOKIES_SECURE', true),
      expires: addMilliSeconds(new Date(), ms(this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')), false)
    });
  }
}
