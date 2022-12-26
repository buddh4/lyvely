import { defineStore } from 'pinia';
import { Ref, ref, toRefs, watch } from 'vue';
import { useStream } from '@/modules/stream/composables/stream.composable';
import {
  ContentModel,
  ContentUpdateStateLiveEvent,
  StreamDirection,
  ContentStreamFilter,
} from '@lyvely/common';
import { useContentStreamService } from '@/modules/content-stream/services/content-stream.service';
import { useLiveStore } from '@/modules/live/stores/live.store';
import { useProfileStore } from '@/modules/profiles/stores/profile.store';

export const useContentStreamStore = defineStore('content-stream', () => {
  const contentStreamService = useContentStreamService();
  const { profile } = toRefs(useProfileStore());
  const live = useLiveStore();
  const isActive = ref(false);
  const parent = ref<ContentModel>();
  const parentId = ref<string | undefined>();
  const stream = useStream<ContentModel, ContentStreamFilter>(
    { batchSize: 25, direction: StreamDirection.BBT },
    contentStreamService,
    new ContentStreamFilter(),
  );

  live.on('content', ContentUpdateStateLiveEvent.eventName, handleContentUpdate);

  watch(profile, async (newProfile, oldProfile) => {
    if (newProfile?.id !== oldProfile?.id) {
      stream.reload(true);
    }
  });

  async function init(root: Ref<HTMLElement>) {
    if (parentId.value) {
      const model = stream.getStreamEntryById(parentId.value);
      const contentPromise = model
        ? Promise.resolve(model)
        : contentStreamService.loadEntry(parentId.value);
      contentPromise.then((c) => (parent.value = c));
    }

    return stream
      .init({
        root: root.value,
        scrollToStart: !parentId.value,
        filter: new ContentStreamFilter({ parent: parentId.value }),
        infiniteScroll: { distance: 20 },
      })
      .then(() => (isActive.value = true));
  }

  async function reset() {
    stream.reset();
    parent.value = undefined;
    parentId.value = undefined;
    isActive.value = false;
  }

  async function handleContentUpdate(evt: ContentUpdateStateLiveEvent) {
    if (!isActive.value) return;

    if (evt.pid === profile.value?.id) {
      stream.update();
    }
  }

  async function setParentId(id: string) {
    parentId.value = id;
    parent.value = undefined;
  }

  return {
    stream,
    isActive,
    parent,
    parentId,
    init,
    reset,
    setParentId,
  };
});
