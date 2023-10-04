import { Injectable } from '@nestjs/common';
import { IGenerateOtpOptions, OtpService } from '../services';
import bcrypt from 'bcrypt';

@Injectable()
export class TestOtpService extends OtpService {
  protected async generateOtp(options: IGenerateOtpOptions) {
    const otp = '000000';
    const hashedOtp = await bcrypt.hash(otp, 10);
    return { otp, hashedOtp };
  }
}
