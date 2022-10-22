<script lang="ts" setup>
import { ref } from "vue";
import { createApiUrl } from "@/repository";
const identity = ref("");

const imageUrl = createApiUrl("/captcha/watever");
</script>

<template>
  <img :src="imageUrl" class="w-full" />
</template>

<style scoped></style>
