<script lang="ts" setup>
import imgUrl from '@/assets/404.png';
import { LyCenteredPanel, LyButton } from '@lyvely/ui';
</script>

<template>
  <ly-centered-panel>
    <template #body>
      <div class="card error-page">
        <img alt="Page Not Found" :src="imgUrl" />
      </div>
    </template>

    <template #footer>
      <ly-button :route="'/'" class="primary" text="common.back_to_home" />
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
