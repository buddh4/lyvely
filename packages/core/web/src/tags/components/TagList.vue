<script lang="ts" setup>
import { useProfileStore } from '@/profiles/stores/profile.store';
import TagBadge from './TagBadge.vue';
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
  <div v-if="tagIds?.length || $slots.pre || $slots.post" class="flex gap-1">
    <slot name="pre"></slot>
    <tag-badge v-for="tag in tags" :key="tag.id" :tag="tag" @click.prevent.stop="select(tag.id)" />
    <slot name="post"></slot>
  </div>
</template>
N

<style scoped>
.badge-category {
  font-weight: normal;
  cursor: pointer;
}
</style>
