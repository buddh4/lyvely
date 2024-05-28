<script lang="ts" setup>
export interface IProps {
  active: boolean;
}

withDefaults(defineProps<IProps>(), {
  active: false,
});
</script>

<template>
  <li class="cursor-pointer hover:bg-highlight dark:hover:bg-main">
    <div :class="['border-l-4 p-4', active ? 'border-pop' : 'border-transparent']">
      <slot></slot>
    </div>
  </li>
</template>

<style scoped></style>
