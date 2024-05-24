<script lang="ts" setup>
import imgUrl from '@/assets/500.png';
import { LyCenteredPanel, LyButton } from '@lyvely/ui';
</script>

<template>
  <ly-centered-panel title="common.status.500">
    <template #body>
      <div class="card error-page">
        <img alt="Unknown error" :src="imgUrl" />
      </div>
    </template>

    <template #footer>
      <div class="flex items-center justify-center">
        <ly-button :route="{ path: '/' }" class="primary" text="common.back_to_home" />
      </div>
    </template>
  </ly-centered-panel>
</template>

<style lang="scss" scoped>
.error-page {
  border-radius: 10px;
  overflow: hidden;

  a {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
}
</style>
