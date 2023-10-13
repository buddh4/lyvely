<script lang="ts" setup>
import { useAppConfigStore } from '@/app-config/store/app-config.store';
import { getLocale, setLocale } from '@/i18n';
import { computed, ref } from 'vue';
import { I18N_MODULE_ID, I18nAppConfig, ILocale } from '@lyvely/core-interface';

const enabledLocales = useAppConfigStore().getModuleConfig<I18nAppConfig, ILocale[]>(
  I18N_MODULE_ID,
  'locales',
);

const activeLocale = ref(getLocale());
const locale = computed(
  () => enabledLocales?.find((locale) => locale.locale === activeLocale.value)?.name,
);

const switchLocale = (locale: string) => {
  return setLocale(locale);
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
