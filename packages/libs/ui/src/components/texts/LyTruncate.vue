<script lang="ts" setup>
import { computed } from 'vue';
import { t, Translatable } from '@/i18n';

export interface IProps {
  text?: Translatable;
  max: number;
}

const props = withDefaults(defineProps<IProps>(), {
  text: '',
});

const trimmedText = computed(() => {
  const text = t(props.text).trim() || '';
  return text.trim().length >= props.max ? text.substring(0, props.max).trim() + '...' : text;
});
</script>

<template>
  <span>
    {{ trimmedText }}
  </span>
</template>

<style scoped></style>
