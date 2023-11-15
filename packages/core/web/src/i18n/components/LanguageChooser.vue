<script lang="ts" setup>
import { useI18nStore } from '@/i18n';
import { useAuthStore } from '@/auth';
import { computed } from 'vue';

const i18nStore = useI18nStore();
const authStore = useAuthStore();
const enabledLocales = i18nStore.getEnabledLocales();

const { getLocaleName } = i18nStore;

const locale = computed(() => getLocaleName(i18nStore.locale));

const switchLocale = (locale: string) => {
  return authStore.setUserLocale(locale);
};
</script>

<template>
  <ly-dropdown icon="language" :label="locale">
    <ly-dropdown-link
      v-for="enabledLocale in enabledLocales"
      :key="enabledLocale"
      :label="getLocaleName(enabledLocale)"
      @click="switchLocale(enabledLocale)" />
  </ly-dropdown>
</template>

<style scoped></style>
