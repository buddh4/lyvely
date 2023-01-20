import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ContentModel, ContentStreamFilter, StreamDirection } from '@lyvely/common';
import { useStream } from '@/modules/stream/composables/stream.composable';
import { useContentStreamService } from '@/modules/content-stream/services/content-stream.service';
import { useContentStreamHistoryStore } from '@/modules/content-stream/stores/content-stream-history.store';

export const useContentStreamStore = defineStore('content-stream', () => {
  const contentStreamService = useContentStreamService();
  const contentStreamHistoryStore = useContentStreamHistoryStore();
  const content = ref<ContentModel>();
  const stream = useStream<ContentModel, ContentStreamFilter>(
    { batchSize: 30, direction: StreamDirection.BBT },
    useContentStreamService(),
    new ContentStreamFilter(),
  );

  async function setContentId(parent: string) {
    content.value = await contentStreamService.loadEntry(parent);
    stream.filter.value = new ContentStreamFilter({ parent });
  }

  return {
    content,
    setContentId,
    ...stream,
  };
});
