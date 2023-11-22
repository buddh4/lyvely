import { defineStore, storeToRefs } from 'pinia';
import { useProfileStore } from '@/profiles/stores/profile.store';
import { watch } from 'vue';
import { ContentModel, ContentStreamFilter, IStreamHistory } from '@lyvely/interface';
import { IStream } from '@/stream/composables/stream.composable';

export interface IContentStreamHistory extends IStreamHistory<ContentModel> {}

export const useContentStreamHistoryStore = defineStore('content-stream-history', () => {
  const { profile } = storeToRefs(useProfileStore());
  let stack = new Map<string, IContentStreamHistory>();

  watch(profile, resetHistory);

  function setHistoryState(
    stream: IStream<ContentModel, ContentStreamFilter>,
    parent = 'root',
    scrollTop: number,
  ) {
    const { state, filter, options, models } = stream;
    stack.set(parent, {
      state: state.value,
      filter: filter.value,
      options: options,
      models: models.value,
      restoreState: { scrollTop },
    });
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
