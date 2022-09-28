<script lang="ts" setup>
import { useAccessibilityStore } from "@/modules/accessibility/stores/accessibilityStore";
import { toRefs } from "vue";

const { messages } = toRefs(useAccessibilityStore());
</script>

<template>
  <div
    class="assistive-text sr-only"
    aria-live="polite"
    aria-relevant="additions"
    aria-hidden="false"
  >
    <slot></slot>
    <div v-for="(message, index) in messages" :key="index">{{ message }}</div>
  </div>
</template>

<style scoped></style>
