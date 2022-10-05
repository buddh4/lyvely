import { Controller, HttpCode, HttpStatus, Post, Body, Param } from '@nestjs/common';
import { UserRegistrationService } from './user-registration.service';
import { Public, UseClassSerializer } from '@/modules/core';
import { UserRegistrationEndpoint, UserRegistrationDto, ENDPOINT_USER_REGISTRATION } from '@lyvely/common';

@Public()
@Controller(ENDPOINT_USER_REGISTRATION)
@UseClassSerializer()
export class UserRegistrationController implements UserRegistrationEndpoint {
  constructor(private registerService: UserRegistrationService) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  async register(@Body() registerDto: UserRegistrationDto) {
    return await this.registerService.register(registerDto);
  }

  @Post()
  async validateEmail(@Param('email') email: string): Promise<boolean> {
    return await this.registerService.validateEmail(email);
  }
}
