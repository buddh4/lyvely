import { Controller, HttpCode, HttpStatus, Post, Body } from '@nestjs/common';
import { UserRegistrationService } from './user-registration.service';
import { Public, UseClassSerializer } from '@/modules/core';
import { UserRegistrationEndpoint, UserRegistrationDto } from '@lyvely/common';

@Public()
@Controller('register')
@UseClassSerializer()
export class UserRegistrationController implements UserRegistrationEndpoint {
  constructor(private registerService: UserRegistrationService) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  async register(@Body() registerDto: UserRegistrationDto) {
    return await this.registerService.register(registerDto);
  }
}
