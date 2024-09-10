<script lang="ts" setup>
import RelativeTime from '@/calendar/components/RelativeTime.vue';
import { ContentModel } from '@lyvely/interface';
import ContentDropdown from '@/content/components/ContentDropdown.vue';
import TagList from '@/tags/components/TagList.vue';
import { useRouter } from 'vue-router';
import ContentMarkdown from './ContentMarkdown.vue';
import { LyIcon } from '@lyvely/ui';
import { useContentStreamEntryInfo } from './content-stream-entry-info.composable';

export interface IProps {
  model: ContentModel;
  showType?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  showType: true,
});

const { icon, iconClass, userInfo, contentTypeName, contentRoute, showUserAvatar } =
  useContentStreamEntryInfo(props);

const router = useRouter();

function selectTag(tagId: string) {
  router.push({ name: 'stream', query: { tagIds: [tagId] } });
}
</script>

<template>
  <div :data-id="model.id">
    <div class="w-full border-divide bg-shadow p-2.5 md:px-4">
      <div class="flex items-center justify-items-stretch gap-2">
        <slot name="image">
          <ly-avatar
            v-if="showUserAvatar"
            class="h-8 w-8"
            :name="userInfo!.displayName"
            :guid="userInfo!.guid" />
          <div v-else class="flex h-8 w-8 justify-center rounded-full border border-divide bg-main">
            <router-link v-if="contentRoute" :to="contentRoute" class="flex justify-center">
              <ly-icon v-if="icon" :name="icon" :class="iconClass" />
            </router-link>
            <ly-icon v-else-if="icon" :name="icon" :class="iconClass" />
          </div>
        </slot>
        <div class="flex flex-col text-sm">
          <slot name="title">
            <ly-truncate class="font-bold" :max="130" :text="model.getTitle()" />
            <relative-time :ts="model.meta.createdAt.getTime()"></relative-time>
          </slot>
        </div>
        <div class="ml-auto flex">
          <slot name="menu">
            <div class="flex flex-col">
              <content-dropdown :content="model" />
            </div>
          </slot>
        </div>
      </div>
    </div>
    <tag-list
      :tag-ids="model.tagIds"
      class="flex w-full bg-main px-2.5 pt-2.5 md:px-4 md:pt-4"
      @select="selectTag">
      <template v-if="showType && contentTypeName" #pre>
        <ly-badge class="bg-secondary-dark">{{ contentTypeName }}</ly-badge>
      </template>
      <template v-if="model.meta.archived" #post>
        <ly-icon name="archive" class="ml-auto w-3 text-warning" />
      </template>
    </tag-list>
    <div class="rounded-b border-divide bg-main p-2.5 text-sm md:px-4">
      <slot name="body">
        <content-markdown :model="model" />
      </slot>
    </div>
    <div v-if="$slots.footer" class="rounded-b border-t border-divide bg-main p-2.5 md:p-4">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped></style>
