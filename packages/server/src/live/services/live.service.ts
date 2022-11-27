import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, fromEvent } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { ConfigurationPath, OperationMode } from '@/core';

const EVENT_LIVE_UPDATE = 'live:update';

@Injectable()
export class LiveService {
  constructor(private eventEmitter: EventEmitter2, private readonly configService: ConfigService<ConfigurationPath>) {}

  emit(eventName: string, ...data: any[]) {
    if (this.configService.get('operationMode') === OperationMode.STANDALONE) {
      this.eventEmitter.emit(EVENT_LIVE_UPDATE, data);
    } else {
      // TODO: redis update
    }
  }

  subscribe(): Observable<any> {
    if (this.configService.get('operationMode') === OperationMode.STANDALONE) {
      return fromEvent(this.eventEmitter, EVENT_LIVE_UPDATE);
    } else {
      // TODO: redis update
    }
  }
}
