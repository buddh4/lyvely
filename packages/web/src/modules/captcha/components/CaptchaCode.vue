<script lang="ts" setup>
import { ref } from "vue";
import { useCaptchaService } from "../services/captcha.service";

const captchaService = useCaptchaService();

const challenge = ref();
const imageUrl = ref();

async function init() {
  challenge.value = await captchaService.challenge();
  imageUrl.value = challenge.value.imageUrl;
}

async function refresh() {
  await captchaService.refresh(challenge.value.identity);
  imageUrl.value = challenge.value.imageUrl + `&v=${Date.now()}`;
}

defineExpose({ refresh })

await init();
</script>

<template>
  <img v-if="imageUrl" :src="imageUrl" class="w-full" />
</template>

<style scoped></style>
