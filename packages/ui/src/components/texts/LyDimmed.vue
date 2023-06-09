<script lang="ts" setup>
import { t } from '@/i18n';

export interface IProps {
  text?: string;
  translate?: boolean;
}

withDefaults(defineProps<IProps>(), {
  text: '',
  translate: true,
});
</script>

<template>
  <p class="text-sm truncate text-dimmed">
    <slot>{{ translate ? t(text) : text }}</slot>
  </p>
</template>

<style scoped></style>
