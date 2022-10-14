import { Controller, Post, Body, Req, UnauthorizedException } from '@nestjs/common';
import { UserRegistrationService } from '../services/user-registration.service';
import { Public, UseClassSerializer, ConfigurationPath } from '@/modules/core';
import {
  UserRegistrationEndpoint,
  UserRegistrationDto,
  ENDPOINT_USER_REGISTRATION,
  VerifyEmailDto,
  UserModel,
} from '@lyvely/common';
import { AbstractAuthController, JwtAuthService } from '@/modules/auth';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import ms from 'ms';

@Controller(ENDPOINT_USER_REGISTRATION)
@UseClassSerializer()
export class UserRegistrationController extends AbstractAuthController implements UserRegistrationEndpoint {
  constructor(
    private registerService: UserRegistrationService,
    private authService: JwtAuthService,
    protected configService: ConfigService<ConfigurationPath>,
  ) {
    super(configService);
  }

  @Public()
  @Post()
  async register(@Body() registerDto: UserRegistrationDto): Promise<void> {
    await this.registerService.register(registerDto);
  }

  @Public()
  @Post('verify-email')
  async verifyEmail(@Body() verifyEmail: VerifyEmailDto, @Req() req: Request) {
    const { user, remember } = await this.registerService.verifyEmail(verifyEmail);
    if (!user) throw new UnauthorizedException();
    const { accessToken, refreshToken, vid } = await this.authService.login(user, remember);

    this.setAuthenticationCookie(req, accessToken);
    this.setRefreshCookie(req, refreshToken);

    return {
      user: new UserModel(user),
      vid: vid,
      token_expiration: ms(this.configService.get('auth.jwt.access.expiresIn')),
    };
  }
}
