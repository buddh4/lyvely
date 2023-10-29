<script lang="ts" setup>
import { LyCenteredPanel, LyButton } from '@lyvely/ui';
import { t } from '@/i18n';
import imgUrl from '@/assets/404.png';
</script>

<template>
  <ly-centered-panel>
    <template #header>
      <div class="flex items-center justify-center">
        <ly-icon name="lyvely" class="fill-current text-lyvely mr-2 w-6" />
        <span class="text-base font-bold"> {{ t('common.status.404') }}</span>
      </div>
    </template>

    <template #body>
      <div class="card error-page">
        <img alt="Page Not Found" :src="imgUrl" />
      </div>
    </template>

    <template #footer>
      <div class="flex justify-center items-center">
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
