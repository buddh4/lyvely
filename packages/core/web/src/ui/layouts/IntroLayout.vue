<script setup lang="ts">
import LanguageChooser from '@/i18n/components/LanguageChooser.vue';
</script>

<template>
  <div class="w-full absolute px-2">
    <LanguageChooser class="float-right" />
  </div>

  <router-view />
</template>

<style scoped></style>
