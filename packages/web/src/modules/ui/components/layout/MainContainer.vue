<script lang="ts" setup>
import { computed } from 'vue';
import { Size } from '@/modules/ui/types';

export interface IProps {
  width?: 'xs' | 'sm' | 'lg' | 'xl' | 'full';
  padding?: string;
  margin?: string;
}

const props = withDefaults(defineProps<IProps>(), {
  width: Size.LG,
  padding: 'p-0.5 pb-5 pt-2 md:p-6',
  margin: 'mb-6 md:mb-0',
});

const widthClass = computed(
  () =>
    ((
      {
        [Size.SM]: 'max-w-screen-sm',
        [Size.LG]: 'max-w-screen-lg',
        [Size.XL]: 'max-w-screen-xl',
        [Size.XS]: 'max-w-screen-xs',
        [Size.Full]: 'max-w-full',
      } as Record<string, string>
    )[props.width] || 'max-w-screen-lg'),
);

const classNames = computed(() => {
  return ['container main-container h-full mx-auto', props.padding, props.margin, widthClass.value];
});
</script>

<template>
  <div class="overflow-y-auto overflow-x-hidden h-full">
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
