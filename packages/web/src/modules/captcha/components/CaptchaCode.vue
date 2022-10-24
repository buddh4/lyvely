<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useCaptchaStore } from '@/modules/captcha/stores/captcha.store';

const captchaStore = useCaptchaStore();
const { imageUrl } = storeToRefs(captchaStore);
</script>

<template>
  <img v-if="imageUrl" :src="imageUrl" class="w-full" />
</template>

<style scoped></style>
