import { IComponentStackEntry } from './component-stack.interface';
import { ref, Ref } from 'vue';

const stackMap = new Map<string, Ref<IComponentStackEntry[]>>();

export const registerComponentStackEntries = (id: string, entry: IComponentStackEntry[]) => {
  entry.forEach((e) => registerComponentStackEntry(id, e));
};

export const registerComponentStackEntry = (id: string, entry: IComponentStackEntry) => {
  if (!stackMap.has(id)) stackMap.set(id, ref([]));
  const entries = stackMap.get(id)!;
  if (entries.value.find((e) => e.id === entry.id)) return;
  else entries.value.push(entry);
};

export const removeComponentStackEntry = (id: string, entry: IComponentStackEntry | string) => {
  if (!stackMap.has(id)) stackMap.set(id, ref([]));
  const entryId = typeof entry === 'string' ? entry : entry.id;
  const entries = stackMap.get(id)!;
  entries.value = entries.value.filter((m) => m.id !== entryId);
};

export const getComponentStackEntries = (id: string) => {
  if (!stackMap.has(id)) stackMap.set(id, ref([]));
  return stackMap.get(id)!;
};

export const clearComponentStack = (menuId: string) => {
  stackMap.delete(menuId);
};
