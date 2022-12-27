<script lang="ts" setup>
import { ContentModel, formatDate, isThisMonth, isToday, formatDateWithTime } from '@lyvely/common';
import { computed } from 'vue';
import RelativeTime from '@/modules/calendar/components/RelativeTime.vue';
import { IStream } from '@/modules/stream/composables/stream.composable';
import { useRouter } from 'vue-router';
import { profileRoute } from '@/modules/profiles/routes/profile-route.util';
import { contentRoute } from '@/modules/content-stream/routes';

export interface IProps {
  model: ContentModel;
  stream: IStream<ContentModel>;
  index: number;
  merge?: boolean;
}

const props = defineProps<IProps>();
const name = computed(() => 'buddh4');
const prevEntry = computed(() => props.stream.getStreamEntryAt(props.index - 1));
const nextEntry = computed(() => props.stream.getStreamEntryAt(props.index + 1));

const showTimeSep = computed(
  () => prevEntry.value && props.model.meta.streamSort - prevEntry.value.meta.streamSort > 1800_000,
);

const showNextTimeSep = computed(
  () => nextEntry.value && nextEntry.value.meta.streamSort - props.model.meta.streamSort > 1800_000,
);

const getSepTime = computed(() => {
  if (!showTimeSep.value) return;

  const ts = props.model.meta.streamSort;
  return isToday(ts) ? formatDate(ts, 'mm:ss') : formatDateWithTime(ts);
});

const mergeWithPrev = computed(
  () =>
    prevEntry.value &&
    props.merge &&
    !showTimeSep.value &&
    prevEntry.value.type === props.model.type &&
    prevEntry.value.meta.createdAs?.authorId === props.model.meta.createdAs?.authorId,
);

const mergeWithNext = computed(
  () =>
    nextEntry.value &&
    props.merge &&
    !showNextTimeSep.value &&
    nextEntry.value.type === props.model.type &&
    nextEntry.value.meta.createdAs?.authorId === props.model.meta.createdAs?.authorId,
);

const cssClass = computed(() => {
  return mergeWithNext.value ? '' : 'pb-2';
});

const router = useRouter();

function onContentClick() {
  router.push(contentRoute(props.model.pid, props.model.id));
}
</script>

<template>
  <div data-stream-entry :class="cssClass">
    <div v-if="showTimeSep" class="flex items-center justify-center text-dimmed text-xs">
      {{ getSepTime }}
    </div>
    <div class="flex items-stretch w-full gap-1">
      <div class="flex justify-center flex-shrink-0 w-9 pt-1">
        <slot v-if="!mergeWithPrev" name="image">
          <ly-user-avatar class="w-8 h-8" />
        </slot>
      </div>
      <div class="mx-3 my-0.5 w-full">
        <div v-if="!mergeWithPrev" class="text-sm mb-2">
          <span class="font-bold mr-1">{{ name }}</span>
          <relative-time :ts="model.meta.streamSort"></relative-time>
        </div>
        <div class="cursor-pointer" @click="onContentClick">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/*.content-stream-entry-content::after,
.content-stream-entry-content::before {
  background-color: var(--color-divide);
  background-image: linear-gradient(var(--elements-main), var(--elements-main));
  position: absolute;
  top: 15px;
  right: 100%;
  left: -8px;
  display: block;
  width: 8px;
  height: 16px;
  pointer-events: none;
  content: ' ';
  clip-path: polygon(0 50%, 100% 0, 100% 100%);
}*/
</style>
