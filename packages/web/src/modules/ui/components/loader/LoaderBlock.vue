<script lang="ts" setup></script>

<template>
  <div class="w-full h-full flex items-center justify-center align-center my-5">
    <span class="animate-spin spinner border-divide border-t-pop"></span>
  </div>
</template>

<style scoped>
.overlay__inner {
  width: 100%;
  height: 100%;
}

.spinner {
  width: 30px;
  height: 30px;
  display: inline-block;
  border-width: 2px;
  border-radius: 100%;
  border-style: solid;
}
</style>
