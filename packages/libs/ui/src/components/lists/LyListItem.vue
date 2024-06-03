<script lang="ts" setup>
import { useTwMerge } from '@/composables';

defineOptions({
  inheritAttrs: false,
});

export interface IProps {
  active?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  active: false,
  disabled: false,
});

const { attrs } = useTwMerge({
  'cursor-pointer hover:bg-highlight dark:hover:bg-main': !props.disabled,
});
</script>

<template>
  <li v-bind="attrs">
    <div :class="['border-l-4 p-4', active ? 'border-pop' : 'border-transparent']">
      <slot></slot>
    </div>
  </li>
</template>

<style scoped></style>
