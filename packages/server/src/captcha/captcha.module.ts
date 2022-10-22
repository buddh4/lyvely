import { Module } from '@nestjs/common';
import { CaptchaController } from '@/captcha/controllers/captcha.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Captcha, CaptchaSchema } from '@/captcha/schemas/captcha.schema';
import { CaptchaDao } from '@/captcha/daos/captcha.dao';
import { CaptchaService } from './services/captcha.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Captcha.name, schema: CaptchaSchema }])],
  providers: [CaptchaDao, CaptchaService],
  controllers: [CaptchaController],
})
export class CaptchaModule {}
