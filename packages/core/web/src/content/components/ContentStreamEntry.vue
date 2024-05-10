<script lang="ts" setup>
import { formatDate, isToday, formatDateWithTime } from '@lyvely/dates';
import { ContentModel } from '@lyvely/interface';
import { computed } from 'vue';
import RelativeTime from '@/calendar/components/RelativeTime.vue';
import { useRouter } from 'vue-router';
import { isTextSelection } from '@lyvely/ui';
import { t } from '@/i18n';
import TagList from '@/tags/components/TagList.vue';
import { IStream } from '@/stream/stream.composable';
import { getContentTypeOptions } from '../registries';
import { useUserInfo } from '@/profiles/composables';
import { toContentDetails } from '@/content';
import ContentToolbar from './ContentToolbar.vue';

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

const userInfo = useUserInfo(props.model.meta.createdBy);

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

function onContentClick(evt: MouseEvent) {
  if (evt.target instanceof HTMLAnchorElement) return;
  if (isTextSelection()) return;
  router.push(toContentDetails(props.model));
}

const contentTypeName = computed(() => t(getContentTypeOptions(props.model.type)?.name || ''));

const bgClass = 'bg-main';
const bodyWrapperClass = computed(
  () =>
    ({
      none: 'relative',
      message: `relative message-bubble ${bgClass} inline-block transition duration-100 cursor-pointer hover:bg-highlight dark:hover:bg-highlight border border-divide px-4 py-1.5`,
      block: `relative inline-flex flex-col border border-divide p-4 rounded-xl ${bgClass} inline-block`,
    })[props.bodyStyle],
);

// Just experimental
const maxWidth = true;
</script>

<template>
  <div data-stream-entry :class="cssClass" :data-id="model.id">
    <div v-if="showTimeSeparator" class="text-dimmed flex items-center justify-center text-xs">
      {{ timeSeparator }}
    </div>
    <div class="flex w-full items-stretch gap-1">
      <div class="flex w-9 flex-shrink-0 justify-center pt-1">
        <slot v-if="!mergeWithPrev" name="image">
          <template v-if="userInfo">
            <ly-avatar
              v-if="userInfo"
              class="h-8 w-8"
              :name="userInfo.displayName"
              :guid="userInfo.guid" />
          </template>
        </slot>
      </div>
      <div class="mx-3 my-0.5 w-full">
        <div v-if="!mergeWithPrev" class="mb-2 text-sm">
          <span class="mr-1 font-bold">
            <slot name="authorName">
              <template v-if="userInfo">
                {{ userInfo.displayName }}
              </template>
            </slot>
          </span>
          <relative-time :ts="model.meta.streamSort"></relative-time>
        </div>
        <div :class="{ 'md:w-2/3': maxWidth && bodyStyle === 'message' }">
          <div :class="bodyWrapperClass" :data-id="'body-' + model.id" @click="onContentClick">
            <div class="inline-block cursor-pointer">
              <div class="flex gap-1">
                <tag-list
                  :class="['mb-2', { 'mt-2': bodyStyle === 'message' }]"
                  :tag-ids="omitTags ? [] : model.tagIds"
                  @select="(tagId) => $emit('selectTag', tagId)">
                  <template v-if="showType && contentTypeName" #pre>
                    <ly-badge class="bg-secondary-dark">{{ contentTypeName }}</ly-badge>
                  </template>
                  <template v-if="model.meta.archived" #post>
                    <ly-icon name="archive" class="text-warning ml-auto w-3" />
                  </template>
                  <template v-if="model.meta.locked" #post>
                    <ly-icon name="locked" class="ml-auto w-3" />
                  </template>
                </tag-list>
              </div>
              <div class="content-stream-entry-body text-sm">
                <slot>
                  <div>
                    <div v-if="model.content.title?.length" class="flex items-center gap-1">
                      <span>{{ model.content.title }}</span>
                    </div>
                    <p v-if="model.content.text?.length" class="text-dimmed text-sm">
                      {{ model.content.text }}
                    </p>
                    <div
                      v-if="!model.content.text?.length && !model.content.title?.length"
                      class="text-dimmed flex items-center gap-1 text-sm">
                      <ly-icon name="warning" class="text-warning" />
                      {{ t('content.stream.empty') }}
                    </div>
                  </div>
                </slot>
              </div>
              <content-toolbar :model="model" :hide-empty-comments="true" />
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

.content-stream-entry-body {
  color: var(--text-main);
}

.content-stream-entry-body a[target^='_blank'] {
  display: flex;
  align-items: center;
}

.content-stream-entry-body a[target^='_blank']::after {
  --svg: url('data:image/svg+xml,\
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">\
            <path d="M17 13v6c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-11c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-11c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293h6c0.552 0 1-0.448 1-1s-0.448-1-1-1h-6c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v11c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h11c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-6c0-0.552-0.448-1-1-1s-1 0.448-1 1zM10.707 14.707l9.293-9.293v3.586c0 0.552 0.448 1 1 1s1-0.448 1-1v-6c0-0.136-0.027-0.265-0.076-0.383s-0.121-0.228-0.216-0.323c-0.001-0.001-0.001-0.001-0.002-0.002-0.092-0.092-0.202-0.166-0.323-0.216-0.118-0.049-0.247-0.076-0.383-0.076h-6c-0.552 0-1 0.448-1 1s0.448 1 1 1h3.586l-9.293 9.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0z"></path>\
        </svg>');

  content: '';
  width: 16px;
  height: 16px;
  margin-left: 4px;
  mask: var(--svg);
  -webkit-mask: var(--svg);
  background-color: white;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  display: inline-block;
}
</style>
