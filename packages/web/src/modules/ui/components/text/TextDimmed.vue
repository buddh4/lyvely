<script lang="ts" setup>
export interface IProps {
  text: string;
}

withDefaults(defineProps<IProps>(), {
  text: undefined,
});
</script>

<template>
  <p class="text-sm truncate text-dimmed">
    <slot>{{ text }}</slot>
  </p>
</template>

<style scoped></style>
