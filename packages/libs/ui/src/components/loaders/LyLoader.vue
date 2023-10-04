<script lang="ts" setup>
interface IProps {
  size?: string;
}

withDefaults(defineProps<IProps>(), {
  size: '30px',
});
</script>

<template>
  <div class="w-full h-full flex items-center justify-center align-center">
    <span
      class="animate-spin spinner border-divide border-t-pop"
      :style="{ width: size, height: size }"></span>
  </div>
</template>

<style scoped>
.overlay__inner {
  width: 100%;
  height: 100%;
}

.spinner {
  display: inline-block;
  border-width: 2px;
  border-radius: 100%;
  border-style: solid;
}
</style>
