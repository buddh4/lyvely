import { Module } from '@nestjs/common';
import { CaptchaController } from './controllers';
import { MongooseModule } from '@nestjs/mongoose';
import { Captcha, CaptchaSchema } from './schemas';
import { CaptchaDao } from './daos';
import { CaptchaService } from './services';
import { CaptchaGuard } from './guards';

@Module({
  imports: [MongooseModule.forFeature([{ name: Captcha.name, schema: CaptchaSchema }])],
  providers: [CaptchaDao, CaptchaService, CaptchaGuard],
  controllers: [CaptchaController],
  exports: [CaptchaGuard, CaptchaService],
})
export class CaptchaModule {}
