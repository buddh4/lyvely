<script lang="ts" setup>
import RelativeTime from '@/calendar/components/RelativeTime.vue';
import { ContentModel } from '@lyvely/interface';
import ContentDropdown from '@/content/components/ContentDropdown.vue';
import TagList from '@/tags/components/TagList.vue';
import { useRouter } from 'vue-router';
import { computed } from 'vue';
import { translate } from '@/i18n';
import { getContentTypeOptions } from '../registries';
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
  <div :data-id="model.id">
    <div class="w-full border-divide bg-shadow p-2.5 md:px-4">
      <div class="flex items-center justify-items-stretch gap-2">
        <slot name="image">
          <ly-avatar
            v-if="userInfo"
            class="h-8 w-8"
            :name="userInfo.displayName"
            :guid="userInfo.guid" />
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
        <ly-markdown-view :md="model.content.text" class="text-sm" />
      </slot>
    </div>
    <div v-if="$slots.footer" class="rounded-b border-t border-divide bg-main p-2.5 md:p-4">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped></style>
