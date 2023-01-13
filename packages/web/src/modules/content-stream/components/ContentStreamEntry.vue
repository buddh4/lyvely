<script lang="ts" setup>
import { formatDate, isToday, formatDateWithTime, ContentModel } from '@lyvely/common';
import { computed } from 'vue';
import RelativeTime from '@/modules/calendar/components/RelativeTime.vue';
import { useRouter } from 'vue-router';
import { contentRoute } from '@/modules/content-stream/routes';
import { isTextSelection } from '@/util/dom.util';
import TagList from '@/modules/tags/components/TagList.vue';
import { IStream } from '@/modules/stream/composables/stream.composable';

export interface IProps {
  model: ContentModel;
  stream?: IStream<ContentModel>;
  index?: number;
  bodyStyle?: 'none' | 'message' | 'block';
  omitTags?: boolean;
  merge?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  stream: undefined,
  bodyStyle: 'block',
  omitTags: false,
  index: 0,
});

const emit = defineEmits(['selectTag']);

const name = computed(() => 'buddh4');
const prevEntry = computed(() => props.stream?.getStreamEntryAt(props.index - 1));
const nextEntry = computed(() => props.stream?.getStreamEntryAt(props.index + 1));

const showTimeSeparator = computed(
  () => prevEntry.value && props.model.meta.streamSort - prevEntry.value.meta.streamSort > 1800_000,
);

const showNextTimeSep = computed(
  () => nextEntry.value && nextEntry.value.meta.streamSort - props.model.meta.streamSort > 1800_000,
);

const timeSeparator = computed(() => {
  if (!showTimeSeparator.value) return;

  const ts = props.model.meta.streamSort;
  return isToday(ts) ? formatDate(ts, 'HH:mm') : formatDateWithTime(ts);
});

const mergeWithPrev = computed(
  () =>
    prevEntry.value &&
    props.merge &&
    !showTimeSeparator.value &&
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
  if (isTextSelection()) return;
  router.push(contentRoute(props.model.pid, props.model.id));
}

const bodyWrapperClass = computed(
  () =>
    ({
      none: '',
      message:
        'inline-block hover:bg-highlight dark:hover:bg-highlight bg-main border border-divide px-4 py-1.5 rounded-3xl',
      block: 'inline-flex flex-col border border-divide p-4 rounded-xl bg-main inline-block',
    }[props.bodyStyle]),
);
</script>

<template>
  <div data-stream-entry :class="cssClass">
    <div v-if="showTimeSeparator" class="flex items-center justify-center text-dimmed text-xs">
      {{ timeSeparator }}
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
        <div :class="{ 'md:w-2/3': bodyStyle === 'message' }">
          <div :class="bodyWrapperClass">
            <div class="cursor-pointer inline-block" @click="onContentClick">
              <tag-list
                v-if="!omitTags"
                :class="{ 'mt-2': bodyStyle === 'message' }"
                :tag-ids="model.tagIds"
                @select="(tagId) => $emit('selectTag', tagId)" />
              <slot></slot>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
