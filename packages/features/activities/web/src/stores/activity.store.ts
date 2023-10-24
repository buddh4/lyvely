import { defineStore } from 'pinia';
import { CalendarInterval } from '@lyvely/dates';
import { ref } from 'vue';
import { localStorageManager } from '@lyvely/web';

export interface IMoveActivityEvent {
  cid: string;
  newIndex: number;
  oldIndex: number;
  fromInterval: CalendarInterval;
  toInterval: CalendarInterval;
}

const DEFAULT_ACTIVITY_VIEW = 'latest_activity_view';
export const latestActivityView = localStorageManager.getStoredValue(DEFAULT_ACTIVITY_VIEW);

export const useActivityStore = defineStore('activities', () => {
  const activeView = ref<string | null | undefined>(latestActivityView.getValue());

  function setActiveView(viewName: string) {
    activeView.value = viewName;
    latestActivityView.setValue(viewName);
  }

  return {
    activeView,
    setActiveView,
  };
});
