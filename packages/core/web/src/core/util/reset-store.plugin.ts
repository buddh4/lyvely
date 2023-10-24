import cloneDeep from 'lodash';
import { PiniaPluginContext } from 'pinia';

export function resetStore({ store }: PiniaPluginContext) {
  const initialState = cloneDeep(store.$state);
  store.$reset = () => store.$patch(<any>cloneDeep(initialState));
}
