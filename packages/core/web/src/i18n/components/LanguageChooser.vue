<script lang="ts" setup>
import { useI18nStore } from '@/i18n';
import { useAuthStore } from '@/auth';
import { computed } from 'vue';

const i18nStore = useI18nStore();
const authStore = useAuthStore();
const enabledLocales = i18nStore.getEnabledLocales();

const locale = computed(() => i18nStore.getLocaleName(i18nStore.locale));

const switchLocale = (locale: string) => {
  return authStore.setUserLocale(locale);
};
</script>

<template>
  <ly-dropdown icon="language" :label="locale">
    <ly-dropdown-link
      v-for="enabledLocale in enabledLocales"
      :key="enabledLocale.locale"
      :label="enabledLocale.name"
      @click="switchLocale(enabledLocale.locale)" />
  </ly-dropdown>
</template>

<style scoped></style>
