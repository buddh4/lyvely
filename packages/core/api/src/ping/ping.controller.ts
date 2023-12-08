import { Controller, Get } from '@nestjs/common';
import { Public } from '@/core';
import { API_PING, IPingResponse, PingEndpoint } from '@lyvely/interface';

@Controller(API_PING)
export class PingController implements PingEndpoint {
  @Public()
  @Get()
  async ping(): Promise<IPingResponse> {
    return { ts: Date.now() };
  }
}
