<script setup lang="ts">
import { ContentModel } from '@lyvely/interface';
import { computed } from 'vue';

export interface IProps {
  model: ContentModel;
}

const props = defineProps<IProps>();
const fileIds = computed(() => props.model.meta.attachedFileIds ?? []);
</script>

<template>
  <div class="flex gap-1">
    <div v-for="fileId of fileIds" :key="fileId" class="rounded border border-divide p-2">
      {{ fileId }}
    </div>
  </div>
</template>

<style scoped></style>
