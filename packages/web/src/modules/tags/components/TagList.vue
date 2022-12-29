<script lang="ts" setup>
import { useProfileStore } from '@/modules/profiles/stores/profile.store';
import { computed } from 'vue';

export interface IProps {
  tagIds: string[];
  feature?: string;
}

const props = defineProps<IProps>();
const emit = defineEmits(['select']);

function select(tagId: string) {
  emit('select', tagId);
}

const tags = computed(() =>
  useProfileStore()
    .getTags()
    .filter((tag) => !tag.archived && props.tagIds.includes(tag.id)),
);
</script>

<template>
  <div v-if="tags.length">
    <ly-tag v-for="tag in tags" :key="tag.id" :tag="tag" @click="select(tag.id)" />
  </div>
</template>

<style scoped>
.badge-category {
  font-weight: normal;
  cursor: pointer;
}
</style>
