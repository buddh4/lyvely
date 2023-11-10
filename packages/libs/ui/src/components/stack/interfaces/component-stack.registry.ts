import { IComponentStackEntry } from './component-stack.interface';
import { ref, Ref, shallowRef } from 'vue';
import { isVueComponent } from '@/helpers';
import { sortBySortOrder } from '@lyvely/common';

const stackMap = new Map<string, Ref<IComponentStackEntry[]>>();

export const registerComponentStackEntries = (id: string, entries: IComponentStackEntry[]) => {
  entries.forEach((e) => registerComponentStackEntry(id, e));
};

export const registerComponentStackEntry = (id: string, entry: IComponentStackEntry) => {
  entry = { ...entry };
  if (isVueComponent(entry.component)) {
    entry.component = shallowRef(entry.component);
  }
  if (!stackMap.has(id)) stackMap.set(id, ref([]));
  const entries = stackMap.get(id)!;
  if (entries.value.find((e) => e.id === entry.id)) return;
  else {
    const entriesValue = entries.value;
    entriesValue.push(entry);
    entries.value = entriesValue.sort(sortBySortOrder);
  }
};

export const removeComponentStackEntry = (id: string, entry: IComponentStackEntry | string) => {
  if (!stackMap.has(id)) stackMap.set(id, ref([]));
  const entryId = typeof entry === 'string' ? entry : entry.id;
  const entries = stackMap.get(id)!;
  entries.value = entries.value.filter((m) => m.id !== entryId);
};

export const getComponentStackEntries = (id: string): Ref<IComponentStackEntry[]> => {
  if (!stackMap.has(id)) {
    stackMap.set(id, ref([]));
  }
  return stackMap.get(id)!;
};

export const clearComponentStack = (menuId: string) => {
  stackMap.delete(menuId);
};
