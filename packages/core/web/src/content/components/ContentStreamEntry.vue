<script lang="ts" setup>
import { formatDate, isToday, formatDateWithTime } from '@lyvely/dates';
import { ContentModel } from '@lyvely/core-interface';
import { computed } from 'vue';
import RelativeTime from '@/calendar/components/RelativeTime.vue';
import { useRouter } from 'vue-router';
import { isTextSelection } from '@/core';
import { translate } from '@/i18n';
import TagList from '@/tags/components/TagList.vue';
import { IStream } from '@/stream/composables/stream.composable';
import { getContentTypeOptions } from '../services';
import { useProfileStore } from '@/profiles/stores/profile.store';
import { computedAsync } from '@vueuse/core';

export interface IProps {
  model: ContentModel;
  stream?: IStream<ContentModel>;
  showType?: boolean;
  index?: number;
  bodyStyle?: 'none' | 'message' | 'block';
  omitTags?: boolean;
  merge?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  stream: undefined,
  showType: true,
  bodyStyle: 'block',
  omitTags: false,
  index: 0,
});

defineEmits(['selectTag']);

const userInfo = computedAsync(async () =>
  useProfileStore().getUserInfo(props.model.meta.createdBy),
);

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
  router.push({ name: 'content-details', params: { pid: props.model.pid, cid: props.model.id } });
}

const contentTypeName = computed(() =>
  translate(getContentTypeOptions(props.model.type)?.name || ''),
);

const childCount = computed(() => {
  if (!props.model.meta.childCount) return 0;
  return Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(props.model.meta.childCount);
});

const bodyWrapperClass = computed(
  () =>
    ({
      none: 'relative',
      message:
        'relative message-bubble inline-block transition duration-200 hover:bg-highlight dark:hover:bg-highlight bg-main border border-divide px-4 py-1.5',
      block:
        'relative inline-flex flex-col border border-divide p-4 rounded-xl bg-main inline-block',
    }[props.bodyStyle]),
);

// Just experimental
const maxWidth = false;
</script>

<template>
  <div data-stream-entry :class="cssClass">
    <div v-if="showTimeSeparator" class="flex items-center justify-center text-dimmed text-xs">
      {{ timeSeparator }}
    </div>
    <div class="flex items-stretch w-full gap-1">
      <div class="flex justify-center flex-shrink-0 w-9 pt-1">
        <slot v-if="!mergeWithPrev" name="image">
          <ly-avatar
            v-if="userInfo"
            class="w-8 h-8"
            :name="userInfo.displayName"
            :guid="userInfo.guid" />
        </slot>
      </div>
      <div class="mx-3 my-0.5 w-full">
        <div v-if="!mergeWithPrev" class="text-sm mb-2">
          <span class="font-bold mr-1">
            <slot name="authorName">
              <template v-if="userInfo">
                {{ userInfo.displayName }}
              </template>
            </slot>
          </span>
          <relative-time :ts="model.meta.streamSort"></relative-time>
        </div>
        <div :class="{ 'md:w-2/3': maxWidth && bodyStyle === 'message' }">
          <div :class="bodyWrapperClass">
            <div class="cursor-pointer inline-block" @click="onContentClick">
              <div class="flex gap-1">
                <tag-list
                  :class="['mb-2', { 'mt-2': bodyStyle === 'message' }]"
                  :tag-ids="omitTags ? [] : model.tagIds"
                  @select="(tagId) => $emit('selectTag', tagId)">
                  <template v-if="showType && contentTypeName" #pre>
                    <ly-badge class="bg-secondary-dark">{{ contentTypeName }}</ly-badge>
                  </template>
                  <template v-if="model.meta.archived" #post>
                    <ly-icon name="archive" class="w-3 text-warning ml-auto" />
                  </template>
                </tag-list>
              </div>
              <div class="text-sm">
                <slot></slot>
              </div>
              <div v-if="model.meta.childCount" class="flex mt-2 justify-end">
                <div
                  class="inline-flex justify-center items-center px-2 py-1 rounded bg-main border border-divide right-2.5 -bottom-2.5 text-xs gap-1">
                  <ly-icon name="stream" />
                  <span>{{ childCount }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.message-bubble {
  border-radius: 18px;
}
</style>
