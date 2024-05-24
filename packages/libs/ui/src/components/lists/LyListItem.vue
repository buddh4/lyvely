<script lang="ts" setup>
export interface IProps {
  active: boolean;
}

withDefaults(defineProps<IProps>(), {
  active: false,
});
</script>

<template>
  <li class="hover:bg-highlight dark:hover:bg-main cursor-pointer">
    <div :class="['border-l-4 p-4', active ? 'border-pop' : 'border-transparent']">
      <slot></slot>
    </div>
  </li>
</template>

<style scoped></style>
