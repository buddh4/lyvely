import { Controller, Post, Body, Req } from '@nestjs/common';
import { UserRegistrationService } from '../services/user-registration.service';
import { Public, UseClassSerializer, ConfigurationPath } from '@/modules/core';
import {
  UserRegistrationEndpoint,
  UserRegistrationDto,
  ENDPOINT_USER_REGISTRATION,
  UserModel,
  ILoginResponse,
  UniqueConstraintException,
} from '@lyvely/common';
import { AbstractAuthController, JwtAuthService } from '@/modules/auth';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
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
  async register(@Body() registerDto: UserRegistrationDto, @Req() req: Request): Promise<ILoginResponse> {
    try {
      const { user } = await this.registerService.register(registerDto);

      const { accessToken, refreshToken, vid } = await this.authService.login(user, registerDto.remember);

      this.setAuthenticationCookie(req, accessToken);
      this.setRefreshCookie(req, refreshToken);

      return {
        user: new UserModel(user),
        vid: vid,
        token_expiration: ms(this.configService.get('auth.jwt.access.expiresIn')),
      };
    } catch (err: any) {
      if (err instanceof UniqueConstraintException) {
        return <any>{};
      }

      throw err;
    }
  }

  /*@Get()
  async verifyEmail(@Param('token') token: string, req: Request) {}
  */
}
