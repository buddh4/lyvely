import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useStream } from '@/modules/stream/composables/stream.composable';
import { ContentModel, ContentUpdateStateLiveEvent, StreamDirection } from '@lyvely/common';
import { useContentStreamService } from '@/modules/content-stream/services/content-stream.service';
import { useLiveStore } from '@/modules/live/stores/live.store';
import { useProfileStore } from '@/modules/profiles/stores/profile.store';

export const useContentStreamStore = defineStore('content-stream', () => {
  const contentStreamService = useContentStreamService();
  const profileStore = useProfileStore();
  const live = useLiveStore();
  const isActive = ref(false);
  const stream = useStream<ContentModel>(
    { batchSize: 20, direction: StreamDirection.BBT },
    contentStreamService,
  );

  live.on('content', ContentUpdateStateLiveEvent.eventName, handleContentUpdate);

  async function handleContentUpdate(evt: ContentUpdateStateLiveEvent) {
    if (!isActive.value) return;

    if (evt.pid === profileStore.profile?.id) {
      stream.update();
    }
  }

  return {
    stream,
    isActive,
  };
});
