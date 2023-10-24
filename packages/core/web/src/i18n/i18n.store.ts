import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getDefaultLocale } from './locale.util';

export const useI18nStore = defineStore('i18n', () => {
  const locale = ref(getDefaultLocale());

  return {
    locale,
  };
});
