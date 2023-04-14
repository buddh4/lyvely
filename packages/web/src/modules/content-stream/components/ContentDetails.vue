<script lang="ts" setup>
import RelativeTime from '@/modules/calendar/components/RelativeTime.vue';
import TextTrimmed from '@/modules/ui/components/text/TextTrimmed.vue';
import { ContentModel } from '@lyvely/common';
import ContentDropdown from '@/modules/content/components/ContentDropdown.vue';
import TagList from '@/modules/tags/components/TagList.vue';
import { useRouter } from 'vue-router';

export interface IProps {
  model: ContentModel;
}

defineProps<IProps>();

const router = useRouter();

function selectTag(tagId: string) {
  router.push({ name: 'stream', query: { tagIds: [tagId] } });
}
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
  <div class="p-2 md:p-4 bg-main border-divide rounded-b">
    <div class="flex justify-end w-full mb-2">
      <tag-list :tag-ids="model.tagIds" @select="selectTag" />
    </div>
    <slot name="body">
      {{ model.content.text }}
    </slot>
  </div>
</template>

<style scoped></style>
