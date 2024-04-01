<script lang="ts" setup>
import { computed, normalizeClass, useAttrs } from 'vue';
import { twMerge } from "tailwind-merge";
import {omit} from "lodash";

const props = withDefaults(defineProps<{
  progress?: number;
}>(), {
  progress: 0,
});

defineOptions({
  inheritAttrs: false,
})

const attrs = useAttrs();

const colorClass = computed(() => {
  if (props.progress < 0.5) return 'bg-warning';
  if (props.progress < 0.75) return 'bg-info';
  return 'bg-success';
});


const progressClass = computed(() =>
  twMerge('progress rounded-full border border-divide w-full h-4 overflow-hidden', normalizeClass(attrs.class))
)
</script>

<template>
  <div v-bind="omit($attrs, 'class')" :class="progressClass">
    <div :class="colorClass" :style="{ width: progress * 100 + '%' }">&nbsp;</div>
  </div>
</template>

<style scoped>
.progress {
  transition: width 2s ease-in;
}
</style>
