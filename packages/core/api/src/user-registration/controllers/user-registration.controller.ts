import { Controller, Post, Body, Req, UnauthorizedException } from '@nestjs/common';
import { UserRegistrationService } from '../services';
import { Public, UseClassSerializer } from '@/core';
import { ConfigurationPath } from '@/config';
import {
  UserRegistrationEndpoint,
  UserRegistration,
  ENDPOINT_USER_REGISTRATION,
  ResendOtp,
  OtpInfo,
  VerifyEmailDto,
  UserModel,
  StringFieldValidityRequest,
  UserRegistrationEndpointPaths,
} from '@lyvely/interface';
import {} from '@/user-account';
import { UniqueConstraintException } from '@lyvely/common';
import { AbstractJwtAuthController, JwtAuthService } from '@/auth';
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
  @Post(UserRegistrationEndpointPaths.CHECK_USERNAME)
  async checkUsername(@Body() userData: StringFieldValidityRequest): Promise<void> {
    await this.registerService.validateUserName(userData.value || '');
  }

  @Public()
  @Post(UserRegistrationEndpointPaths.CHECK_USER_EMAIL)
  async checkUserEmail(@Body() userData: StringFieldValidityRequest): Promise<void> {
    await this.registerService.validateEmail(userData.value || '');
  }

  @Public()
  @Post(UserRegistrationEndpointPaths.RESENT_VERIFY_EMAIL)
  async resendVerifyEmail(@Body() dto: ResendOtp): Promise<OtpInfo> {
    return await this.registerService.resendOtp(dto.emailOrUsername);
  }

  @Public()
  @Post(UserRegistrationEndpointPaths.VERIFY_EMAIL)
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
