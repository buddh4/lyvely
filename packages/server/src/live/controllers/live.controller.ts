import { Controller, Sse, Req } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { fromEvent } from 'rxjs';
import { UserRequest } from '@/users';

@Controller('/live')
export class LiveController {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  @Sse('/user')
  async userUpdates(@Req() request: UserRequest) {
    return fromEvent(this.eventEmitter, 'test');
  }
}
