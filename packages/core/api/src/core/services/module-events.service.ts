import { Injectable } from '@nestjs/common';
import { ModuleRegistry } from '../components';
import { EventEmitter2 } from 'eventemitter2';

export const EVENT_MODULE_REGISTRATION = 'module_registration';

@Injectable()
export class ModuleEventsService {
  constructor(private emitter: EventEmitter2, private moduleRegistry: ModuleRegistry) {
    moduleRegistry.onRegistration((meta) => {
      emitter.emit(EVENT_MODULE_REGISTRATION, meta);
    });
  }
}
