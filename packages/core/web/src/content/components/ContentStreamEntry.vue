<script lang="ts" setup>
import { formatDate, formatDateWithTime, isToday } from '@lyvely/dates';
import { ContentModel } from '@lyvely/interface';
import { computed } from 'vue';
import RelativeTime from '@/calendar/components/RelativeTime.vue';
import { useRouter } from 'vue-router';
import { isTextSelection, LyIcon, LyMarkdownView } from '@lyvely/ui';
import { t } from '@/i18n';
import TagList from '@/tags/components/TagList.vue';
import { IStream } from '@/stream/stream.composable';
import { getContentTypeIcon, getContentTypeOptions } from '../registries';
import { useUserInfo } from '@/profiles/composables';
import { toContentDetails } from '@/content/routes/content-route.helper';
import ContentToolbar from './ContentToolbar.vue';
import { type IDefaultStreamEntryOptions, StreamEntryLayout } from '@/content/interfaces';

export interface IProps {
  model: ContentModel;
  stream?: IStream<ContentModel>;
  index?: number;
  layout?: StreamEntryLayout;
  icon?: string;
  iconClass?: string;
  omitTags?: boolean;
  merge?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  stream: undefined,
  omitTags: undefined,
  layout: undefined,
  icon: undefined,
  iconClass: undefined,
  merge: undefined,
  index: 0,
});

defineEmits(['selectTag']);

const contentTypeOptions = getContentTypeOptions(props.model);
const streamEntryOptions = (<IDefaultStreamEntryOptions>contentTypeOptions?.interfaces?.stream)
  ?.entryOptions;
const merge = computed(() => props.merge ?? streamEntryOptions?.merge ?? true);
const layout = computed(
  () => props.layout ?? (streamEntryOptions?.layout || StreamEntryLayout.Block)
);
const isMessageLayout = layout.value === StreamEntryLayout.Message;
const icon = computed(() => props.icon ?? getContentTypeIcon(props.model));
const iconClass = computed(() => props.iconClass ?? (streamEntryOptions?.iconClass || 'text-main'));
const omitTags = computed(() => props.omitTags ?? streamEntryOptions?.omitTags ?? false);
const contentTypeRoute = contentTypeOptions?.route;

const userInfo = useUserInfo(props.model.meta.createdBy);

const prevEntry = computed(() => props.stream?.getStreamEntryAt(props.index - 1));
const nextEntry = computed(() => props.stream?.getStreamEntryAt(props.index + 1));

const showTimeSeparator = computed(
  () => prevEntry.value && props.model.meta.streamSort - prevEntry.value.meta.streamSort > 1800_000
);

const showNextTimeSep = computed(
  () => nextEntry.value && nextEntry.value.meta.streamSort - props.model.meta.streamSort > 1800_000
);

const timeSeparator = computed(() => {
  if (!showTimeSeparator.value) return;

  const ts = props.model.meta.streamSort;
  return isToday(ts) ? formatDate(ts, 'HH:mm') : formatDateWithTime(ts);
});

const mergeWithPrev = computed(
  () =>
    prevEntry.value &&
    merge.value &&
    !showTimeSeparator.value &&
    prevEntry.value.type === props.model.type &&
    prevEntry.value.meta.createdAs?.authorId === props.model.meta.createdAs?.authorId
);

const mergeWithNext = computed(
  () =>
    nextEntry.value &&
    merge.value &&
    !showNextTimeSep.value &&
    nextEntry.value.type === props.model.type &&
    nextEntry.value.meta.createdAs?.authorId === props.model.meta.createdAs?.authorId
);

const paddingBottom = computed(() => {
  return mergeWithNext.value ? '' : 'pb-2';
});

const router = useRouter();

function onContentClick(evt: MouseEvent) {
  if (evt.target instanceof HTMLAnchorElement) return;
  if (evt.target instanceof HTMLButtonElement) return;
  if (isTextSelection()) return;
  router.push(toContentDetails(props.model));
}

const contentTypeName = t(contentTypeOptions?.name || '');

const showUserAvatar = computed(
  () => !props.icon && userInfo.value && (isMessageLayout || !icon.value)
);

const borderClass = 'border border-divide dark:hover:border-gray-600 hover:border-gray-400';
const baseLayoutClass = `relative inline-flex flex-col max-w-full cursor-pointer bg-main ${borderClass}`;
const bodyWrapperClass = computed(
  () =>
    ({
      none: 'relative',
      message: `message-bubble ${baseLayoutClass} px-4 py-1.5`,
      block: `${baseLayoutClass} p-4 rounded-xl`,
    })[layout.value]
);

// Just experimental
const maxWidth = true;
</script>

<template>
  <div data-stream-entry :class="['text-sm', paddingBottom]" :data-id="model.id" @dragstart.prevent>
    <div
      v-if="showTimeSeparator"
      class="flex select-none items-center justify-center text-xs text-dimmed">
      {{ timeSeparator }}
    </div>
    <div class="flex items-stretch gap-1">
      <div class="flex w-9 flex-shrink-0 justify-center pt-1">
        <slot v-if="!mergeWithPrev" name="image">
          <ly-avatar
            v-if="showUserAvatar"
            class="h-8 w-8"
            :name="userInfo!.displayName"
            :guid="userInfo!.guid" />
          <div
            v-else-if="contentTypeRoute"
            :class="['flex h-8 w-8 justify-center rounded-full bg-main', borderClass]">
            <router-link :to="contentTypeRoute" class="flex justify-center">
              <ly-icon v-if="icon" :name="icon" :class="iconClass" />
            </router-link>
          </div>
          <ly-icon v-else-if="icon" :name="icon" :class="iconClass" />
        </slot>
      </div>
      <div class="mx-3 my-0.5 min-w-0 grow">
        <div v-if="!mergeWithPrev" class="mb-2 select-none text-sm">
          <span class="mr-1 font-bold">
            <slot name="authorName">
              <template v-if="userInfo">
                {{ userInfo.displayName }}
              </template>
            </slot>
          </span>
          <relative-time class="select-none" :ts="model.meta.streamSort"></relative-time>
        </div>
        <div :class="{ 'md:w-2/3': maxWidth && isMessageLayout }">
          <div :class="bodyWrapperClass" :data-id="'body-' + model.id" @click="onContentClick">
            <div class="inline-block max-w-full cursor-pointer">
              <div class="flex gap-1">
                <tag-list
                  :class="['mb-2', { 'mt-2': isMessageLayout }]"
                  :tag-ids="omitTags ? [] : model.tagIds"
                  @select="(tagId) => $emit('selectTag', tagId)">
                  <template v-if="!isMessageLayout && contentTypeName" #pre>
                    <ly-badge class="bg-secondary-dark">{{ contentTypeName }}</ly-badge>
                  </template>
                  <template v-if="model.meta.archived" #post>
                    <ly-icon
                      v-if="model.meta.archived"
                      name="archive"
                      class="ml-auto w-3 text-warning" />
                    <ly-icon v-if="model.meta.locked" name="locked" class="ml-auto w-3" />
                  </template>
                </tag-list>
              </div>
              <div class="text-sm">
                <slot>
                  <div>
                    <h1 v-if="model.content.title?.length">{{ model.content.title }}</h1>
                    <ly-markdown-view :md="model.content.text!" :max-height="true" />
                    <div
                      v-if="!model.content.text?.length && !model.content.title?.length"
                      class="flex items-center gap-1 text-sm text-dimmed">
                      <ly-icon name="warning" class="text-warning" />
                      {{ t('content.stream.no-content') }}
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
</style>
