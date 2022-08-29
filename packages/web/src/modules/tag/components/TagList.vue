<script lang="ts" setup>
import Tag from "./Tag.vue";
import { useProfileStore } from "@/modules/profile/stores/profile.store";
import { computed } from 'vue';

interface Props {
  tagIds: string[],
  feature?: string
}

const props = defineProps<Props>();
const emit = defineEmits(['select']);

function select(tagId: string) {
  emit('select', tagId);
}

const tags = computed(() => useProfileStore().getTags().filter(tag => !tag.archived && props.tagIds.includes(tag.id)));
</script>

<template>
  <div v-if="tags.length">
    <Tag v-for="tag in tags" :key="tag.id" :tag="tag" @click="select(tag.id)" />
  </div>
  <div v-else>
    <br/>
  </div>
</template>

<style scoped>
.badge-category {
  font-weight: normal;
  cursor: pointer;
}
</style>
