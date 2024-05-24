import mitt, { Emitter } from 'mitt';
import type { LyvelyAppEvents } from '../interfaces';
import matching from './matching.mitt-plugin';

// Todo: We use any for app events to prevent circular dependencies

const eventBus = matching(mitt<any>());

export function useEventBus<TEvents extends Record<string, unknown> = LyvelyAppEvents>(): Emitter<
  TEvents & LyvelyAppEvents
> {
  return eventBus as Emitter<TEvents & LyvelyAppEvents>;
}
