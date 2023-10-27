<script lang="ts" setup>
import { twMerge } from 'tailwind-merge';
import { computed } from 'vue';

interface IProps {
  size?: string;
  iconClass?: string;
  wrapperClass?: string;
}

const props = withDefaults(defineProps<IProps>(), {
  size: '30px',
  iconClass: '',
  wrapperClass: '',
});

const iconClassMerged = computed(() => {
  return twMerge('animate-spin spinner border-divide border-t-pop inline-block', props.iconClass);
});

const wrapperClassMerged = computed(() => {
  return twMerge('w-full h-full flex items-center justify-center align-center', props.wrapperClass);
});
</script>

<template>
  <div :class="wrapperClassMerged">
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
