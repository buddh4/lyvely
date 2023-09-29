import { Controller, Post, Body, Req, UnauthorizedException } from '@nestjs/common';
import { UserRegistrationService } from '../services/user-registration.service';
import { Public, UseClassSerializer, ConfigurationPath } from '@lyvely/core';
import {
  UserRegistrationEndpoint,
  UserRegistration,
  ENDPOINT_USER_REGISTRATION,
} from '@lyvely/user-registrations-interface';
import { VerifyEmailDto } from '@lyvely/user-accounts';
import { ResendOtp, OtpInfo } from '@lyvely/otp';
import { UniqueConstraintException } from '@lyvely/common';
import { UserModel } from '@lyvely/users';
import { AbstractJwtAuthController, JwtAuthService } from '@lyvely/auth';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import ms from 'ms';

@Controller(ENDPOINT_USER_REGISTRATION)
@UseClassSerializer()
export class UserRegistrationController
  extends AbstractJwtAuthController
  implements UserRegistrationEndpoint
{
  constructor(
    private registerService: UserRegistrationService,
    private authService: JwtAuthService,
    protected configService: ConfigService<ConfigurationPath & any>,
  ) {
    super(configService);
  }

  @Public()
  @Post()
  async register(@Body() registerDto: UserRegistration): Promise<OtpInfo> {
    try {
      return await this.registerService.register(registerDto);
    } catch (err: any) {
      // Fake an otp to prevent user enumeration attacks
      if (err instanceof UniqueConstraintException) {
        return new OtpInfo({ issuedAt: new Date(), expiresIn: ms('2m') });
      }

      throw err;
    }
  }

  @Public()
  @Post('resend-verify-email')
  async resendVerifyEmail(@Body() dto: ResendOtp): Promise<OtpInfo> {
    try {
      return await this.registerService.resendOtp(dto.email);
    } catch (err: any) {
      if (err instanceof UnauthorizedException) {
        return new OtpInfo({ issuedAt: new Date(), expiresIn: ms('2m') });
      }

      throw err;
    }
  }

  @Public()
  @Post('verify-email')
  async verifyEmail(@Body() verifyEmail: VerifyEmailDto, @Req() req: Request) {
    const { user, remember } = await this.registerService.verifyEmail(verifyEmail);
    if (!user) throw new UnauthorizedException();
    const { accessToken, refreshToken, vid } = await this.authService.login(user, !!remember);

    this.setAuthenticationCookie(req, accessToken);
    this.setRefreshCookie(req, refreshToken, !!remember);

    return {
      user: new UserModel(user),
      vid: vid,
      token_expiration: ms(this.configService.get<string>('auth.jwt.access.expiresIn')!),
    };
  }
}