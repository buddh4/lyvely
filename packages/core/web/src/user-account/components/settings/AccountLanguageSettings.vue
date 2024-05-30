<script setup lang="ts">
import { getFallbackLocale, t, useI18nStore } from '@/i18n';
import { isTouchScreen, LyModal } from '@lyvely/ui';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/auth';
import { computed, ref } from 'vue';
import { useSetAccountLanguageStore, useSetAccountTimezoneStore } from '@/user-account/stores';
import { getTimezone, getTimezones } from '@lyvely/dates';

const { user } = storeToRefs(useAuthStore());
const { getLocaleName, getEnabledLocaleDefinitions } = useI18nStore();
const userLocaleName = computed(() => {
  return getLocaleName(user.value!.locale?.toLowerCase() || getFallbackLocale());
});
const userLocaleTimezone = computed(() => {
  return user.value!.timezone || t('common.not-set');
});

const setLanguageStore = useSetAccountLanguageStore();
const { resetUpdateLocale, setLanguage } = setLanguageStore;
const { updateLocale, showSetLanguageModal } = storeToRefs(setLanguageStore);

const setTimezoneStore = useSetAccountTimezoneStore();
const { resetUpdateTimezone, setTimezone } = setTimezoneStore;
const { updateTimezone, showSetTimezoneModal } = storeToRefs(setTimezoneStore);

const timezoneSearch = ref('');

const timezones = computed(() =>
  getTimezones()
    .sort((a, b) => {
      if (a === user.value?.timezone) return -1;
      if (b === user.value?.timezone) return 1;
      if (a === getTimezone()) return -1;
      if (b === getTimezone()) return 1;
      return 0;
    })
    .filter(
      (tz) =>
        !timezoneSearch.value.length ||
        tz.toLowerCase().includes(timezoneSearch.value.toLowerCase())
    )
);
</script>

<template>
  <ly-list-page title="user-account.i18n.settings" class="mb-2">
    <table class="w-full border-collapse rounded bg-main text-sm">
      <tr>
        <th class="w-3/4 p-3 text-left">
          {{ t('user-account.i18n.language') }}
        </th>
        <td class="bg-main p-3 text-left">
          <ly-button class="secondary" @click="showSetLanguageModal = true">
            {{ userLocaleName }}
          </ly-button>
        </td>
      </tr>
      <tr>
        <th class="w-3/4 p-3 text-left">
          {{ t('user-account.i18n.timezone') }}
        </th>
        <td class="bg-main p-3 text-left">
          <ly-button class="secondary" @click="showSetTimezoneModal = true">
            {{ userLocaleTimezone }}
          </ly-button>
        </td>
      </tr>
    </table>
  </ly-list-page>

  <ly-modal
    v-model="showSetLanguageModal"
    title="user-account.i18n.language"
    @submit="setLanguage"
    @cancel="resetUpdateLocale">
    <div class="flex flex-col gap-2">
      <div
        v-for="def in getEnabledLocaleDefinitions()"
        :key="def.locale"
        class="flex cursor-pointer rounded p-3 hover:bg-highlight"
        @click="updateLocale = def.locale">
        <div class="flex-grow">
          {{ def.name }}
        </div>

        <ly-radio v-model="updateLocale" :value="def.locale" />
      </div>
    </div>
  </ly-modal>

  <ly-modal
    v-model="showSetTimezoneModal"
    title="user-account.i18n.timezone"
    @submit="setTimezone"
    @cancel="resetUpdateTimezone">
    <div class="relative mb-2 inline-block w-full">
      <input
        ref="search"
        v-model="timezoneSearch"
        :autofocus="!isTouchScreen()"
        type="text"
        :placeholder="t('tags.view.search')"
        class="search w-full rounded-r-3xl border-divide bg-main p-1 pl-2 text-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
      <ly-icon name="search" class="pointer-events-none absolute right-2.5 top-2 text-dimmed" />
    </div>
    <div class="md:h-96">
      <div class="flex flex-col gap-2">
        <div
          v-for="tz in timezones"
          :key="tz"
          class="flex cursor-pointer rounded p-3 hover:bg-highlight"
          @click="updateTimezone = tz">
          <div class="flex-grow">
            {{ tz }}
          </div>

          <ly-radio v-model="updateTimezone" :value="tz" />
        </div>
      </div>
    </div>
  </ly-modal>
</template>

<style scoped></style>
