import { Controller, HttpCode, HttpStatus, Post, Body, BadRequestException } from '@nestjs/common';
import { UserRegistrationService } from '../services/user-registration.service';
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
}
