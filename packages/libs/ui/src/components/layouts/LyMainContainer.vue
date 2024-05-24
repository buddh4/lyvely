<script lang="ts" setup>
import { computed } from 'vue';
import { Size } from '@/types';

export interface IProps {
  width?: 'xs' | 'sm' | 'lg' | 'xl' | 'full';
}

const props = withDefaults(defineProps<IProps>(), {
  width: Size.LG,
});

const widthClass = computed(
  () =>
    (
      ({
        [Size.SM]: 'max-w-screen-sm',
        [Size.LG]: 'max-w-screen-lg',
        [Size.XL]: 'max-w-screen-xl',
        [Size.XS]: 'max-w-screen-xs',
        [Size.Full]: 'max-w-full',
      }) as Record<string, string>
    )[props.width] || 'max-w-screen-lg',
);

const classNames = computed(() => {
  return ['w-full main-container mx-auto', widthClass.value];
});
</script>

<template>
  <div
    v-mobile-scrollbar
    class="scrollbar-thin flex flex-grow items-stretch overflow-y-auto overflow-x-hidden">
    <main :class="classNames">
      <slot></slot>
    </main>
  </div>
</template>

<style>
@media (max-width: 767px) {
  .main-container {
    min-width: 100vw;
  }
}
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
