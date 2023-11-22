import { Controller, Get } from '@nestjs/common';
import { Public } from '@/core';
import { ENDPOINT_PING, IPingResponse, PingEndpoint } from '@lyvely/interface';

@Controller(ENDPOINT_PING)
export class PingController implements PingEndpoint {
  @Public()
  @Get()
  async ping(): Promise<IPingResponse> {
    return { ts: Date.now() };
  }
}
