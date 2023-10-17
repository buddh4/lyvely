import { IMenuEntry } from './menus.interface';
import { ref, Ref } from 'vue';

const menusMap = new Map<string, Ref<IMenuEntry[]>>();

export const registerMenuEntries = (menuId: string, entry: IMenuEntry[]) => {
  entry.forEach((e) => registerMenuEntry(menuId, e));
};

export const registerMenuEntry = (menuId: string, entry: IMenuEntry) => {
  if (!menusMap.has(menuId)) menusMap.set(menuId, ref([]));
  const entries = menusMap.get(menuId)!;
  if (entries.value.find((e) => e.id === entry.id)) return;
  else entries.value.push(entry);
};

export const removeMenuEntry = (menuId: string, entry: IMenuEntry | string) => {
  if (!menusMap.has(menuId)) menusMap.set(menuId, ref([]));
  const entryId = typeof entry === 'string' ? entry : entry.id;
  const entries = menusMap.get(menuId)!;
  entries.value = entries.value.filter((m) => m.id !== entryId);
};

export const getMenuEntries = (menuId: string) => {
  if (!menusMap.has(menuId)) menusMap.set(menuId, ref([]));
  return menusMap.get(menuId)!;
};

export const clearMenu = (menuId: string) => {
  menusMap.delete(menuId);
};
