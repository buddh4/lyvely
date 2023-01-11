import { defineStore, storeToRefs } from 'pinia';
import { IStream } from '@/modules/stream/composables/stream.composable';
import { ContentModel, ContentStreamFilter } from '@lyvely/common';
import { useProfileStore } from '@/modules/profiles/stores/profile.store';
import { watch } from 'vue';

type IContentStream = IStream<ContentModel, ContentStreamFilter>;
type IStreamHistoryState = {
  cid?: string;
};
type IContentStreamHistory = {
  stream: IContentStream;
  state: IStreamHistoryState;
};

export const useContentStreamStore = defineStore('content-stream', () => {
  const { profile } = storeToRefs(useProfileStore());
  let stack = new Map<string, IContentStreamHistory>();

  watch(profile, reset);

  function setHistoryState(stream: IContentStream, parent = 'root', cid: string) {
    stack.set(parent, { stream, state: { cid } });
  }

  function getHistoryState(parent = 'root') {
    return stack.get(parent);
  }

  function reset() {
    stack = new Map<string, IContentStreamHistory>();
  }

  return {
    setHistoryState,
    getHistoryState,
    reset,
  };
});
