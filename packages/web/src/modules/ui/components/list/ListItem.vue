<script lang="ts" setup>
interface Props {
  active: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  active: false,
});
</script>

<template>
  <li class="hover:bg-highlight dark:hover:bg-main cursor-pointer">
    <div :class="['p-4 border-l-4', active ? 'border-pop' : 'border-transparent']">
      <slot></slot>
    </div>
  </li>
</template>

<style scoped>

</style>
