import {
  ClassSerializerInterceptor,
  Controller,
  UseInterceptors,
 Post, Body } from '@nestjs/common';

import { RegisterDto } from '@lyvely/common';
import { RegisterService } from './register.service';
import { Public } from '../auth/decorators/public.decorator';

@Public()
@Controller('register')
export class RegisterController {
  constructor(private registerService: RegisterService) {}

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  async register(@Body() registerDto: RegisterDto): Promise<boolean> {
    try {
      await this.registerService.register(registerDto);
      return true;
    } catch(e) {
      throw e;
    }
  }
}
