import { Body, Controller, Post, Req, UploadedFile, UseInterceptors, ParseFilePipeBuilder } from '@nestjs/common';
import {
  AccountEndpoint,
  AddEmailDto,
  ENDPOINT_ACCOUNT,
  VerifyEmailDto,
  ResendOtpDto,
  AvatarModel,
} from '@lyvely/common';
import { UseClassSerializer } from '@/core';
import { UserRequest } from '@/users';
import { AccountService } from '@/account/services/account.service';
import { LocalFilesInterceptor } from '@/files/interceptors';
import { ConfigService } from '@nestjs/config';
import { getLocalFilePath } from '@/files/file-path.utils';

@Controller(ENDPOINT_ACCOUNT)
@UseClassSerializer()
export class AccountController implements AccountEndpoint {
  constructor(private accountService: AccountService) {}

  @Post('add-email')
  async addEmail(@Body() dto: AddEmailDto, @Req() req: UserRequest) {
    return this.accountService.addEmail(req.user, dto.email);
  }

  @Post('verify-email')
  async verifyEmail(@Body() dto: VerifyEmailDto, @Req() req: UserRequest) {
    await this.accountService.verifyEmail(req.user, dto);
  }

  @Post('resend-otp')
  async resendOtp(@Body() dto: ResendOtpDto, @Req() req: UserRequest) {
    return this.accountService.resendOtp(req.user, dto.email);
  }

  @Post('update-avatar')
  @UseInterceptors(
    LocalFilesInterceptor({
      fieldName: 'file',
      configPath: 'file.local.path',
      destination: (req: UserRequest, configService: ConfigService) => getLocalFilePath('/avatars', configService),
      filename: (req: UserRequest) => req.user.guid,
    }),
  )
  async updateAvatar(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 1_000_000 })
        //  .addFileTypeValidator({ fileType: 'jpeg' })
        .build(),
    )
    file: Express.Multer.File,
    @Req() req: UserRequest,
  ) {
    const avatar = await this.accountService.updateAvatar(req.user);
    return new AvatarModel(avatar);
  }
}
