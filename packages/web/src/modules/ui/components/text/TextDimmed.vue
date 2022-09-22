<script lang="ts" setup>
interface Props {
  text: string;
}

const props = withDefaults(defineProps<Props>(), {
  text: undefined,
});

</script>

<template>
  <p class="text-sm truncate text-dimmed">
    <slot>{{ text }}</slot>
  </p>
</template>

<style scoped>

</style>
