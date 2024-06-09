import { Body, Post, Req, UploadedFile, UseInterceptors, UseGuards } from '@nestjs/common';
import {
  AddEmailDto,
  API_USER_ACCOUNT,
  VerifyEmailDto,
  AvatarModel,
  ResendOtp,
  SetLanguageDto,
  SetTimezoneDto,
  CalendarPreferences,
  SettingsUpdateResponse,
  UserAccountEndpoint,
  UserAccountEndpoints,
  UserRole,
} from '@lyvely/interface';
import { UserRequest, UserRoleAccess, UserThrottle, UserThrottlerGuard } from '@/users';
import { UseClassSerializer } from '@/core';
import { GlobalController } from '@/common';
import { UserAccountService, AccountAvatarService } from '../services';
import { FileInterceptor } from '@nestjs/platform-express';
import { AvatarUploadPipe } from '@/avatars';
import type { IFileInfo } from '@/files';

@GlobalController(API_USER_ACCOUNT)
@UserRoleAccess(UserRole.User)
@UseClassSerializer()
export class UserAccountController implements UserAccountEndpoint {
  constructor(
    private userAccountService: UserAccountService,
    private accountAvatarService: AccountAvatarService
  ) {}

  @Post(UserAccountEndpoints.ADD_EMAIL)
  async addEmail(@Body() dto: AddEmailDto, @Req() req: UserRequest) {
    return this.userAccountService.addEmail(req.user, dto.email);
  }

  @Post(UserAccountEndpoints.SET_LANGUAGE)
  async setLanguage(@Body() dto: SetLanguageDto, @Req() req: UserRequest) {
    return this.userAccountService.setLanguage(req.user, dto.locale);
  }

  @Post(UserAccountEndpoints.SET_TIMEZONE)
  async setTimezone(@Body() dto: SetTimezoneDto, @Req() req: UserRequest) {
    return this.userAccountService.setTimezone(req.user, dto.timezone);
  }

  @Post(UserAccountEndpoints.SET_CALENDAR_PREFERENCES)
  async setCalendarPreferences(
    @Body() model: CalendarPreferences,
    @Req() req: UserRequest
  ): Promise<SettingsUpdateResponse> {
    const settings = await this.userAccountService.setCalendarPreferences(req.user, model);
    return new SettingsUpdateResponse({ settings });
  }

  @Post(UserAccountEndpoints.VERIFY_EMAIL)
  async verifyEmail(@Body() dto: VerifyEmailDto, @Req() req: UserRequest) {
    await this.userAccountService.verifyEmail(req.user, dto);
  }

  @Post(UserAccountEndpoints.RESEND_OTP)
  async resendOtp(@Body() dto: ResendOtp, @Req() req: UserRequest) {
    return this.userAccountService.resendOtp(req.user, dto.emailOrUsername);
  }

  @Post(UserAccountEndpoints.UPDATE_AVATAR)
  @UseGuards(UserThrottlerGuard)
  @UserThrottle(20, 60_000)
  @UseInterceptors(FileInterceptor('file'))
  async updateAvatar(@UploadedFile(AvatarUploadPipe) file: IFileInfo, @Req() req: UserRequest) {
    const avatar = await this.accountAvatarService.updateAvatar(req.user, file);
    return new AvatarModel(avatar);
  }

  @Post(UserAccountEndpoints.UPDATE_GAVATAR)
  @UseGuards(UserThrottlerGuard)
  @UserThrottle(20, 60_000)
  async updateGravatar(@Req() req: UserRequest) {
    const avatar = await this.accountAvatarService.updateGravatar(req.user);
    return new AvatarModel(avatar);
  }
}
