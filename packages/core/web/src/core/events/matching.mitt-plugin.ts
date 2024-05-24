import { Emitter, Handler } from 'mitt';

/**
 * This mitt plugin enables wildcard event handlers.
 *
 * @param {Emitter<Events>} mitt - The Emitter object to attach the event handlers to.
 * @returns {Emitter<Events>} - The modified Emitter object.
 * @throws {Error} - If event types with multiple wildcards are used.
 */
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
