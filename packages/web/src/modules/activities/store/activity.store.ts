import { defineStore } from 'pinia';
import { CalendarIntervalEnum } from '@lyvely/common';
import { ref } from 'vue';
import { localStorageManager } from '@/util';

export interface IMoveActivityEvent {
  cid: string;
  newIndex: number;
  oldIndex: number;
  fromInterval: CalendarIntervalEnum;
  toInterval: CalendarIntervalEnum;
}

const DEFAULT_ACTIVITY_VIEW = 'latest_activity_view';
export const latestActivityView = localStorageManager.getStoredValue(DEFAULT_ACTIVITY_VIEW);

export const useActivityStore = defineStore('activities', () => {
  const activeView = ref<string>(latestActivityView.getValue() || 'Habits');

  function setActiveView(view: 'Habits' | 'Tasks') {
    activeView.value = view;
    latestActivityView.setValue(view);
  }

  return {
    activeView,
    setActiveView,
  };
});
