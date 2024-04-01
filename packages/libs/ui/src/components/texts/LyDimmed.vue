<script lang="ts" setup>
import { t, Translatable } from '@/i18n';

export interface IProps {
  text?: Translatable;
  truncate?: boolean;
}

withDefaults(defineProps<IProps>(), {
  text: '',
  truncate: false,
});
</script>

<template>
  <p :class="[{ truncate }, 'text-dimmed hover:text-main']">
    <slot>{{ t(text) }}</slot>
  </p>
</template>

<style scoped></style>
