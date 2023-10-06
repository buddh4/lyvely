import mitt, { Emitter, Handler, WildcardHandler } from 'mitt';

// Todo: We use any for app events to prevent circular dependencies

type GlobalEvents = {
  'app.init.pre': void;
  'app.init.post': any;
  'app.mount.pre': any;
  'app.mount.post': any;
  'app.need.refresh': any;
  'app.offline.ready': any;
} & Record<string, any>;

export default function matching<
  EventType extends string,
  Events extends Record<EventType, any>,
  Key extends string & keyof Events,
>(mitt: Emitter<Events>) {
  const { on, off } = mitt;
  const mk = (pattern: Key, fn: Handler<Events[Key]>) => {
    return (type: Key, e: Events[Key]) => {
      const split = pattern.split('*');
      if (split.length > 2) {
        throw new Error('Event types with multiple wildcards are not supported');
      }

      if (type.startsWith(split[0]) && type.endsWith(split[1])) return fn(e);
    };
  };
  mitt.on = <any>(
    ((type: Key, fn: Handler<Events[Key]>) =>
      type.match(/^.*[*]/) ? on('*', <any>mk(type, fn)) : on(type, fn))
  );
  mitt.off = <any>(
    ((type: Key, fn: Handler<Events[Key]>) =>
      type.match(/^.*[*]/) ? off('*', <any>mk(type, fn)) : off(type, fn))
  );
  return mitt;
}

export const eventBus = matching(mitt<GlobalEvents>());
export type AppEvents = Emitter<GlobalEvents>;