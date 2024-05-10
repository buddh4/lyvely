<script setup lang="ts">
import type { ContentModel } from '@lyvely/interface';
import { computed } from 'vue';
import { toContentDetails } from '@/content';

interface IProps {
  model: ContentModel;
  hideEmptyComments?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  hideEmptyComments: false,
});

const childCount = computed(() => {
  if (!props.model.meta.childCount) return '0';
  return Intl.NumberFormat('en-us', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(props.model.meta.childCount);
});
</script>

<template>
  <div v-if="!hideEmptyComments || model.meta.childCount" class="mt-2 flex justify-end">
    <slot name="pre" />
    <ly-button
      :route="toContentDetails(model)"
      class="bg-main border-divide -bottom-2.5 right-2.5 inline-flex items-center justify-center gap-1 rounded border px-2 py-1 text-xs">
      <ly-icon name="stream" />
      <span v-if="childCount != '0'">{{ childCount }}</span>
    </ly-button>
    <slot name="post" />
  </div>
</template>

<style scoped></style>
