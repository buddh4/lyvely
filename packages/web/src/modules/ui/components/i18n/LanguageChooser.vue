<script lang="ts" setup>
import LyDropdown from "@/modules/ui/components/menu/DropdownMenu.vue";
import { useAppConfigStore } from "@/modules/app-config/store/app-config.store";
import { getLocale, setLocale } from "@/i18n";
import { computed, ref } from "vue";

const appConfigStore = useAppConfigStore();
const enabledLocales = appConfigStore.get("locales");

const activeLocale = ref(getLocale());
const locale = computed(
  () =>
    enabledLocales?.find((locale) => locale.locale === activeLocale.value)?.name
);

const switchLocale = (locale: string) => {
  return setLocale(locale);
};
</script>

<template>
  <ly-dropdown icon="language" :label="locale">
    <ly-dropdown-link
      v-for="locale in enabledLocales"
      :key="locale.locale"
      @click="switchLocale(locale.locale)"
    >
      {{ locale.name }}
    </ly-dropdown-link>
  </ly-dropdown>
</template>

<style scoped></style>
