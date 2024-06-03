<script lang="ts" setup>
import { twMerge } from 'tailwind-merge';
import { computed } from 'vue';
import { useTwMerge } from '@/composables';

defineOptions({
  inheritAttrs: false,
});

interface IProps {
  size?: string;
  iconClass?: string;
}

const props = withDefaults(defineProps<IProps>(), {
  size: '30px',
  iconClass: '',
});

const { attrs } = useTwMerge('w-full h-full flex items-center justify-center align-center');

const iconClassMerged = computed(() => {
  return twMerge('animate-spin spinner border-divide border-t-pop inline-block', props.iconClass);
});
</script>

<template>
  <div v-bind="attrs">
    <span :class="iconClassMerged" :style="{ width: size, height: size }"></span>
  </div>
</template>

<style scoped>
.overlay__inner {
  width: 100%;
  height: 100%;
}

.spinner {
  border-width: 2px;
  border-radius: 100%;
  border-style: solid;
}
</style>
