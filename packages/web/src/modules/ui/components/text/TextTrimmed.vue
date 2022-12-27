<script lang="ts" setup>
import { computed } from 'vue';

export interface IProps {
  text: string;
  max: number;
}

const props = defineProps<IProps>();

const trimmedText = computed(() => {
  const text = props.text?.trim() || '';
  return text.trim().length >= props.max ? text.substring(0, props.max) + '...' : text;
});
</script>

<template>
  <span>
    {{ trimmedText }}
  </span>
</template>

<style scoped></style>
