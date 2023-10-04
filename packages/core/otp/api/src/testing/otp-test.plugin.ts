import { TestPlugin } from '@lyvely/testing';
import { OtpModule } from '../otp.module';
import { OtpService } from '../services';
import { TestOtpService } from './test-otp.service';

export const otpTestPlugin = {
  apply(builder) {
    builder.imports([OtpModule]);
  },
  prepare(moduleBuilder) {
    moduleBuilder.overrideProvider(OtpService).useClass(TestOtpService);
  },
} as TestPlugin;
