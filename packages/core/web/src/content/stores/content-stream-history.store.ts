import { defineStore, storeToRefs } from 'pinia';
import { useProfileStore } from '@/profiles/stores/profile.store';
import { watch } from 'vue';
import { ContentModel, ContentStreamFilter, IStreamHistory } from '@lyvely/interface';
import { IStream } from '@/stream/stream.composable';
import { useContentStore } from '@/content';
import { findAndRemove, findAndReplace } from '@lyvely/common';

export interface IContentStreamHistory extends IStreamHistory<ContentModel> {}

export const useContentStreamHistoryStore = defineStore('content-stream-history', () => {
  const { profile } = storeToRefs(useProfileStore());
  let stack = new Map<string, IContentStreamHistory>();

  watch(profile, resetHistory);

  /**
   * TODO: Note, this will not filter the stream, so it will for example show previously archived content.
   * Not sure if this is too bad but maybe we should somehow run the stream filter again.
   */
  useContentStore().onContentUpdated('*', (content: ContentModel) => {
    for (const history of stack.values()) {
      if (history.filter.test(content)) {
        findAndReplace(history.models, content, 'id');
      } else {
        findAndRemove(history.models, content, 'id');
      }
    }
  });

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
