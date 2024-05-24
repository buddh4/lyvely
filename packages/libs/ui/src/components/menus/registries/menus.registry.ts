import { IMenuEntry } from '../interfaces';
import { ref, Ref } from 'vue';

const menusMap = new Map<string, Ref<MenuEntryRegistration<any>[]>>();

export type MenuEntryRegistration<TContext = any> =
  | IMenuEntry
  | ((context: TContext) => IMenuEntry);

export const registerMenuEntries = <TContext = any>(
  menuId: string,
  entry: MenuEntryRegistration<TContext>[],
) => {
  entry.forEach((e) => registerMenuEntry<TContext>(menuId, e));
};

export const registerMenuEntry = <TContext = any>(
  menuId: string,
  entry: MenuEntryRegistration<TContext>,
) => {
  if (!menusMap.has(menuId)) menusMap.set(menuId, ref([]));
  const entries = menusMap.get(menuId)!;
  entries.value.push(entry);
};

export const getMenuEntries = <TContext = any>(
  menuId: string,
  context?: TContext,
): IMenuEntry[] => {
  if (!menusMap.has(menuId)) menusMap.set(menuId, ref([]));
  return menusMap
    .get(menuId)!
    .value.map((item) => (typeof item === 'function' ? item(context) : item));
};

export const clearMenu = (menuId: string) => {
  menusMap.delete(menuId);
};
