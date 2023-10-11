<script lang="ts" setup>
import RelativeTime from '@/calendar/components/RelativeTime.vue';
import { ContentModel } from '@lyvely/core-interface';
import ContentDropdown from '@/content/components/ContentDropdown.vue';
import TagList from '@/tags/components/TagList.vue';
import { useRouter } from 'vue-router';
import { computed } from 'vue';
import { translate } from '@/i18n';
import { getContentTypeOptions } from '@/content-stream';

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
  <div class="p-2.5 md:px-4 bg-shadow border-divide w-full">
    <div class="flex items-center justify-items-stretch gap-2">
      <slot name="image">
        <ly-user-avatar class="w-8 h-8" />
      </slot>
      <div class="flex flex-col">
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
  <div v-if="model.tagIds?.length" class="bg-main px-2.5 pt-2.5 md:px-4 md:pt-4">
    <div class="flex w-full">
      <tag-list :tag-ids="model.tagIds" @select="selectTag">
        <template #pre>
          <ly-badge class="bg-secondary-dark" :translate="false">{{ contentTypeName }}</ly-badge>
        </template>
        <template v-if="model.meta.archived" #post>
          <ly-icon name="archive" class="w-3 text-warning ml-auto" />
        </template>
      </tag-list>
    </div>
  </div>
  <div class="p-2.5 md:px-4 bg-main border-divide rounded-b">
    <slot name="body">
      {{ model.content.text }}
    </slot>
  </div>
  <div v-if="$slots.footer" class="bg-main rounded-b p-2.5 md:p-4 border-t border-divide">
    <slot name="footer" />
  </div>
</template>

<style scoped></style>
