import { defineStore, storeToRefs } from 'pinia';
import { useProfileStore } from '@/modules/profiles/stores/profile.store';
import { watch, Ref } from 'vue';
import {
  IContentStreamHistory,
  IContentStreamState,
} from '@/modules/content-stream/interfaces/content-stream.interface';

export const useContentStreamHistoryStore = defineStore('content-stream-history', () => {
  const { profile } = storeToRefs(useProfileStore());
  let stack = new Map<string, IContentStreamHistory>();

  watch(profile, resetHistory);

  function setHistoryState(stream: IContentStreamState, parent = 'root', cid: string) {
    stack.set(parent, { stream, state: { cid } });
  }

  function removeHistoryState(parent = 'root') {
    stack.delete(parent);
  }

  function getHistoryState(parent = 'root') {
    return stack.get(parent);
  }

  function resetHistory() {
    stack = new Map<string, IContentStreamHistory>();
  }

  return {
    setHistoryState,
    getHistoryState,
    removeHistoryState,
    resetHistory,
  };
});
