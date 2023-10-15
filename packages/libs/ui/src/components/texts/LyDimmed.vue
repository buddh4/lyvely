<script lang="ts" setup>
import { t, Translatable } from '@/i18n';
import { getTextSizeClass, TextSize } from '@/types';

export interface IProps {
  text?: Translatable;
  size: TextSize;
  truncate?: boolean;
}

withDefaults(defineProps<IProps>(), {
  text: '',
  size: TextSize.SM,
  truncate: false,
});
</script>

<template>
  <p :class="[getTextSizeClass(size), { truncate }, 'text-dimmed']">
    <slot>{{ t(text) }}</slot>
  </p>
</template>

<style scoped></style>
