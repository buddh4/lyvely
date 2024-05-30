import mitt, { Emitter, EventType, Handler, WildcardHandler } from 'mitt';

interface IEmitterWrapper<Events extends Record<EventType, unknown>> {
  emitter: Emitter<Events>;
}

export type DelegateEmitterType<Events extends Record<EventType, unknown>> =
  IEmitterWrapper<Events> & Emitter<Events>;

export function useAsEmitter<Events extends Record<EventType, unknown>>(): Emitter<Events> {
  function on<Key extends keyof Events>(type: Key, handler: Handler<Events[Key]>): void;
  function on(type: '*', handler: WildcardHandler<Events>): void;
  function on<Key extends keyof Events>(
    type: Key | '*',
    handler: Handler<Events[Key]> | WildcardHandler<Events>
  ): void {
    this.emitter.on(type, handler);
  }

  function off<Key extends keyof Events>(type: Key, handler?: Handler<Events[Key]>): void;
  function off(type: '*', handler: WildcardHandler<Events>): void;
  function off<Key extends keyof Events>(
    type: Key | '*',
    handler?: Handler<Events[Key]> | WildcardHandler<Events>
  ): void {
    this.emitter.off(type, handler);
  }

  function emit<Key extends keyof Events>(type: Key, event: Events[Key]): void;
  function emit<Key extends keyof Events>(type: undefined extends Events[Key] ? Key : never): void;
  function emit<Key extends keyof Events>(
    type: undefined extends Events[Key] ? Key : never,
    event?: Events[Key]
  ): void {
    this.emitter.emit(type, event);
  }

  return {
    get all() {
      return this.emitter?.all;
    },
    on,
    off,
    emit,
  };
}

export class DelegateEmitter<Events extends Record<EventType, unknown>>
  implements Omit<Emitter<Events>, 'all'>
{
  emitter: Emitter<Events>;

  constructor(emitter?: Emitter<Events>) {
    this.emitter = emitter || mitt<Events>();
  }

  on<Key extends keyof Events>(type: Key, handler: Handler<Events[Key]>): void;
  on(type: '*', handler: WildcardHandler<Events>): void;
  on<Key extends keyof Events>(
    type: Key | '*',
    handler: Handler<Events[Key]> | WildcardHandler<Events>
  ): void {
    this.emitter.on(type, <any>handler);
  }

  off<Key extends keyof Events>(type: Key, handler?: Handler<Events[Key]>): void;
  off(type: '*', handler: WildcardHandler<Events>): void;
  off<Key extends keyof Events>(
    type: Key | '*',
    handler?: Handler<Events[Key]> | WildcardHandler<Events>
  ): void {
    this.emitter.off(type, <any>handler);
  }

  emit<Key extends keyof Events>(type: Key, event: Events[Key]): void;
  emit<Key extends keyof Events>(type: undefined extends Events[Key] ? Key : never): void;
  emit<Key extends keyof Events>(
    type: undefined extends Events[Key] ? Key : never,
    event?: Events[Key]
  ): void {
    this.emitter.emit(type, <any>event);
  }
}
