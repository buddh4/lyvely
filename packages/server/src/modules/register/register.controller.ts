import { Controller, HttpCode, HttpStatus, Post, Body } from '@nestjs/common';
import { RegisterDto } from '@lyvely/common';
import { RegisterService } from './register.service';
import { Public } from '../auth/decorators/public.decorator';
import { UseClassSerializer } from "../core";

@Public()
@Controller('register')
@UseClassSerializer()
export class RegisterController {
  constructor(private registerService: RegisterService) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  async register(@Body() registerDto: RegisterDto): Promise<boolean> {
    try {
      await this.registerService.register(registerDto);
      return true;
    } catch(e) {
      throw e;
    }
  }
}
