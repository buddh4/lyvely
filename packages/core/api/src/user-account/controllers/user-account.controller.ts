import {
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import {
  AddEmailDto,
  ENDPOINT_USER_ACCOUNT,
  VerifyEmailDto,
  AvatarModel,
  ResendOtp,
  SetLanguageDto,
  SetTimezoneDto,
  CalendarPreferences,
  SettingsUpdateResponse,
  UserAccountEndpoint,
  UserAccountEndpointPaths,
} from '@lyvely/interface';
import { UserRequest, UserThrottle, UserThrottlerGuard } from '@/users';
import { UseClassSerializer } from '@/core';
import { UserAccountService, AccountAvatarService } from '../services';
import { ParseFilePipeBuilder, MimeTypeValidator } from '@/files';
import { FileInterceptor } from '@nestjs/platform-express';

const avatarPipe = new ParseFilePipeBuilder()
  .addMaxSizeValidator({ maxSize: 1_000_000 })
  .addFileTypeValidator({ fileType: 'jpeg' })
  .addValidator(new MimeTypeValidator({ type: ['image/jpeg'] }))
  .build();

@Controller(ENDPOINT_USER_ACCOUNT)
@UseClassSerializer()
export class UserAccountController implements UserAccountEndpoint {
  constructor(
    private userAccountService: UserAccountService,
    private accountAvatarService: AccountAvatarService,
  ) {}

  @Post(UserAccountEndpointPaths.ADD_EMAIL)
  async addEmail(@Body() dto: AddEmailDto, @Req() req: UserRequest) {
    return this.userAccountService.addEmail(req.user, dto.email);
  }

  @Post(UserAccountEndpointPaths.SET_LANGUAGE)
  async setLanguage(@Body() dto: SetLanguageDto, @Req() req: UserRequest) {
    return this.userAccountService.setLanguage(req.user, dto.locale);
  }

  @Post(UserAccountEndpointPaths.SET_TIMEZONE)
  async setTimezone(@Body() dto: SetTimezoneDto, @Req() req: UserRequest) {
    return this.userAccountService.setTimezone(req.user, dto.timezone);
  }

  @Post(UserAccountEndpointPaths.SET_CALENDAR_PREFERENCES)
  async setCalendarPreferences(
    @Body() model: CalendarPreferences,
    @Req() req: UserRequest,
  ): Promise<SettingsUpdateResponse> {
    const settings = await this.userAccountService.setCalendarPreferences(req.user, model);
    return new SettingsUpdateResponse({ settings });
  }

  @Post(UserAccountEndpointPaths.VERIFY_EMAIL)
  async verifyEmail(@Body() dto: VerifyEmailDto, @Req() req: UserRequest) {
    await this.userAccountService.verifyEmail(req.user, dto);
  }

  @Post(UserAccountEndpointPaths.RESEND_OTP)
  async resendOtp(@Body() dto: ResendOtp, @Req() req: UserRequest) {
    return this.userAccountService.resendOtp(req.user, dto.emailOrUsername);
  }

  @Post(UserAccountEndpointPaths.UPDATE_AVATAR)
  @UseGuards(UserThrottlerGuard)
  @UserThrottle(20, 60)
  @UseInterceptors(FileInterceptor('file'))
  async updateAvatar(@UploadedFile(avatarPipe) file: Express.Multer.File, @Req() req: UserRequest) {
    const avatar = await this.accountAvatarService.updateAvatar(req.user, file);
    return new AvatarModel(avatar);
  }

  @Post(UserAccountEndpointPaths.UPDATE_GAVATAR)
  @UseGuards(UserThrottlerGuard)
  @UserThrottle(20, 60)
  async updateGravatar(@Req() req: UserRequest) {
    const avatar = await this.accountAvatarService.updateGravatar(req.user);
    return new AvatarModel(avatar);
  }
}