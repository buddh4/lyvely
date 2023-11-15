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
  AccountEndpoint,
  AddEmailDto,
  ENDPOINT_ACCOUNT,
  VerifyEmailDto,
  AvatarModel,
  ResendOtp,
  SetLanguageDto,
  SetTimezoneDto,
  CalendarPreferences,
  SettingsUpdateResponse,
} from '@lyvely/core-interface';
import { UserRequest, UserThrottle, UserThrottlerGuard } from '@/users';
import { UseClassSerializer } from '@/core';
import { AccountService, AccountAvatarService } from '../services';
import { ParseFilePipeBuilder, MimeTypeValidator } from '@/files';
import { FileInterceptor } from '@nestjs/platform-express';

const avatarPipe = new ParseFilePipeBuilder()
  .addMaxSizeValidator({ maxSize: 1_000_000 })
  .addFileTypeValidator({ fileType: 'jpeg' })
  .addValidator(new MimeTypeValidator({ type: ['image/jpeg'] }))
  .build();

@Controller(ENDPOINT_ACCOUNT)
@UseClassSerializer()
export class AccountController implements AccountEndpoint {
  constructor(
    private accountService: AccountService,
    private accountAvatarService: AccountAvatarService,
  ) {}

  @Post('add-email')
  async addEmail(@Body() dto: AddEmailDto, @Req() req: UserRequest) {
    return this.accountService.addEmail(req.user, dto.email);
  }

  @Post('set-language')
  async setLanguage(@Body() dto: SetLanguageDto, @Req() req: UserRequest) {
    return this.accountService.setLanguage(req.user, dto.locale);
  }

  @Post('set-timezone')
  async setTimezone(@Body() dto: SetTimezoneDto, @Req() req: UserRequest) {
    return this.accountService.setTimezone(req.user, dto.timezone);
  }

  @Post('set-calendar-preferences')
  async setCalendarPreferences(
    @Body() model: CalendarPreferences,
    @Req() req: UserRequest,
  ): Promise<SettingsUpdateResponse> {
    const settings = await this.accountService.setCalendarPreferences(req.user, model);
    return new SettingsUpdateResponse({ settings });
  }

  @Post('verify-email')
  async verifyEmail(@Body() dto: VerifyEmailDto, @Req() req: UserRequest) {
    await this.accountService.verifyEmail(req.user, dto);
  }

  @Post('resend-otp')
  async resendOtp(@Body() dto: ResendOtp, @Req() req: UserRequest) {
    return this.accountService.resendOtp(req.user, dto.emailOrUsername);
  }

  @Post('update-avatar')
  @UseGuards(UserThrottlerGuard)
  @UserThrottle(20, 60)
  @UseInterceptors(FileInterceptor('file'))
  async updateAvatar(@UploadedFile(avatarPipe) file: Express.Multer.File, @Req() req: UserRequest) {
    const avatar = await this.accountAvatarService.updateAvatar(req.user, file);
    return new AvatarModel(avatar);
  }

  @Post('update-gravatar')
  @UseGuards(UserThrottlerGuard)
  @UserThrottle(20, 60)
  async updateGravatar(@Req() req: UserRequest) {
    const avatar = await this.accountAvatarService.updateGravatar(req.user);
    return new AvatarModel(avatar);
  }
}
