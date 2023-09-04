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
  ResendOtp,
  AvatarModel,
} from '@lyvely/common';
import { UseClassSerializer } from '@lyvely/core';
import { UserRequest, UserThrottle, UserThrottlerGuard } from '@lyvely/users';
import { AccountService, AccountAvatarService } from '../services';
import { ParseFilePipeBuilder, MimeTypeValidator } from '@lyvely/files';
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

  @Post('verify-email')
  async verifyEmail(@Body() dto: VerifyEmailDto, @Req() req: UserRequest) {
    await this.accountService.verifyEmail(req.user, dto);
  }

  @Post('resend-otp')
  async resendOtp(@Body() dto: ResendOtp, @Req() req: UserRequest) {
    return this.accountService.resendOtp(req.user, dto.email);
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