<script lang="ts" setup>
import RelativeTime from '@/calendar/components/RelativeTime.vue';
import { ContentModel } from '@lyvely/core-interface';
import ContentDropdown from '@/content/components/ContentDropdown.vue';
import TagList from '@/tags/components/TagList.vue';
import { useRouter } from 'vue-router';
import { computed, unref } from 'vue';
import { translate } from '@/i18n';
import { getContentTypeOptions } from '../services';
import { useUserInfo } from '@/profiles/composables';
import { LyMarkdownView } from '@lyvely/ui';

export interface IProps {
  model: ContentModel;
  showType?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  showType: true,
});

const router = useRouter();

function selectTag(tagId: string) {
  router.push({ name: 'stream', query: { tagIds: [tagId] } });
}

const contentTypeName = computed(() =>
  translate(getContentTypeOptions(props.model.type)?.name || ''),
);

const userInfo = useUserInfo(props.model.meta.createdBy);
</script>

<template>
  <div class="p-2.5 md:px-4 bg-shadow border-divide w-full">
    <div class="flex items-center justify-items-stretch gap-2">
      <slot name="image">
        <ly-avatar
          v-if="userInfo"
          class="w-8 h-8"
          :name="unref(userInfo).displayName"
          :guid="unref(userInfo).guid" />
      </slot>
      <div class="flex flex-col text-sm">
        <slot name="title">
          <ly-trim class="font-bold" :max="130" :text="model.getTitle()" />
          <relative-time :ts="model.meta.createdAt.getTime()"></relative-time>
        </slot>
      </div>
      <div class="flex ml-auto">
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
    class="flex w-full px-2.5 pt-2.5 md:px-4 md:pt-4 bg-main"
    @select="selectTag">
    <template v-if="showType && contentTypeName" #pre>
      <ly-badge class="bg-secondary-dark">{{ contentTypeName }}</ly-badge>
    </template>
    <template v-if="model.meta.archived" #post>
      <ly-icon name="archive" class="w-3 text-warning ml-auto" />
    </template>
  </tag-list>
  <div class="p-2.5 md:px-4 bg-main border-divide rounded-b text-sm">
    <slot name="body">
      <ly-markdown-view :md="model.content.text" class="text-sm" />
    </slot>
  </div>
  <div v-if="$slots.footer" class="bg-main rounded-b p-2.5 md:p-4 border-t border-divide">
    <slot name="footer" />
  </div>
</template>

<style scoped></style>
