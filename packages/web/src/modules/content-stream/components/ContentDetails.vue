<script lang="ts" setup>
import RelativeTime from '@/modules/calendar/components/RelativeTime.vue';
import TextTrimmed from '@/modules/ui/components/text/TextTrimmed.vue';
import { ContentModel } from '@lyvely/common';
import ContentDropdown from '@/modules/content/components/ContentDropdown.vue';
import TagList from '@/modules/tags/components/TagList.vue';
import { useRouter } from 'vue-router';
import { computed } from 'vue';
import { translate } from '@/i18n';
import { getContentTypeOptions } from '@/modules/content-stream';
import LyIcon from '@/modules/ui/components/icon/UIIcon.vue';
import LyBadge from '@/modules/ui/components/badge/BadgeText.vue';

export interface IProps {
  model: ContentModel;
}

const props = defineProps<IProps>();

const router = useRouter();

function selectTag(tagId: string) {
  router.push({ name: 'stream', query: { tagIds: [tagId] } });
}

const contentTypeName = computed(() =>
  translate(getContentTypeOptions(props.model.type)?.name || ''),
);
</script>

<template>
  <div class="p-2 md:p-4 bg-shadow border-divide w-full">
    <div class="flex items-center justify-items-stretch gap-2">
      <slot name="image">
        <ly-user-avatar class="w-8 h-8" />
      </slot>
      <div class="flex flex-col">
        <slot name="title">
          <text-trimmed class="font-bold" :max="130" :text="model.getTitle()" />
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
  <div v-if="model.tagIds?.length" class="bg-main px-2 pt-2 md:px-4 md:pt-4">
    <div class="flex w-full">
      <tag-list :tag-ids="model.tagIds" @select="selectTag">
        <template #pre>
          <ly-badge class="bg-secondary-dark">{{ contentTypeName }}</ly-badge>
        </template>
        <template v-if="model.meta.archived" #post>
          <ly-icon name="archive" class="w-3 text-warning ml-auto" />
        </template>
      </tag-list>
    </div>
  </div>
  <div class="p-2 md:p-4 bg-main border-divide rounded-b">
    <slot name="body">
      {{ model.content.text }}
    </slot>
  </div>
  <div v-if="$slots.footer" class="bg-main px-1 md:p-2 border-t border-divide">
    <slot name="footer" />
  </div>
</template>

<style scoped></style>
