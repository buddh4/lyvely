<script lang="ts" setup>
import { ContentModel } from '@lyvely/common';
import { useRouter } from 'vue-router';
import TagList from '@/modules/tags/components/TagList.vue';

interface IProps {
  content: ContentModel;
}

defineProps<IProps>();

const router = useRouter();

function selectTag(tagId: string) {
  router.push({ name: 'stream', query: { tagIds: [tagId] } });
}
</script>

<template>
  <div v-if="content.tagIds?.length" class="bg-main px-1 md:p-2 border-t border-divide">
    <div class="flex w-full mt-2">
      <tag-list :tag-ids="content.tagIds" @select="selectTag" />
    </div>
  </div>
</template>

<style scoped></style>
