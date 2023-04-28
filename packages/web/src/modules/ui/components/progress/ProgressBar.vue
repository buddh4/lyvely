<script lang="ts" setup>
import { computed } from 'vue';

export interface IProps {
  progress?: number;
}

const props = withDefaults(defineProps<IProps>(), {
  progress: 0,
});

const colorClass = computed(() => {
  if (props.progress < 0.5) return 'bg-warning';
  if (props.progress < 0.75) return 'bg-info';
  return 'bg-success';
});
</script>

<template>
  <div class="rounded-full border border-divide w-full h-4 overflow-hidden">
    <div :class="colorClass" :style="{ width: progress * 100 + '%' }">&nbsp;</div>
  </div>
</template>

<style scoped></style>
