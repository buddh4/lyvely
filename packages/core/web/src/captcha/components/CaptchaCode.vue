<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useCaptchaStore } from '@/captcha/captcha.store';
import { t } from '@/i18n';

const captchaStore = useCaptchaStore();
const { imageUrl } = storeToRefs(captchaStore);
</script>

<template>
  <div style="min-height: 140px">
    <img
      v-if="captchaStore.status.isStatusSuccess() && imageUrl"
      alt="Captcha code"
      :src="imageUrl"
      class="w-full" />
    <div v-else-if="captchaStore.status.isStatusError()">
      <ly-alert type="danger">
        {{ t('error.unknown') }}
      </ly-alert>
    </div>
    <div v-else class="h-full">
      <ly-loader />
    </div>
  </div>
</template>

<style scoped></style>
