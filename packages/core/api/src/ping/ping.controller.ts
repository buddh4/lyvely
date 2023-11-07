import { Controller, Get } from '@nestjs/common';
import { Public } from '@/core';

@Controller('ping')
export class PingController {
  @Public()
  @Get()
  async ping() {
    return { ts: Date.now() };
  }
}
