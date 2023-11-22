<script setup lang="ts">
import { getFallbackLocale, t, useI18nStore } from '@/i18n';
import { LyModal } from '@lyvely/ui';
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
    .filter((tz) => !timezoneSearch.value.length || tz.includes(timezoneSearch.value)),
);
</script>

<template>
  <ly-list-page title="user-account.i18n.settings" class="mb-2">
    <table class="border-collapse text-sm w-full bg-main rounded">
      <tr>
        <th class="p-3 text-left w-3/4">
          {{ t('user-account.i18n.language') }}
        </th>
        <td class="bg-main p-3 text-left">
          <ly-button class="secondary" @click="showSetLanguageModal = true">
            {{ userLocaleName }}
          </ly-button>
        </td>
      </tr>
      <tr>
        <th class="p-3 text-left w-3/4">
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
        class="hover:bg-highlight p-3 rounded cursor-pointer flex"
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
    <div class="relative inline-block w-full mb-2">
      <input
        ref="search"
        v-model="timezoneSearch"
        type="text"
        :placeholder="$t('tags.view.search')"
        class="search pl-2 border-divide text-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-r-3xl p-1 bg-main w-full" />
      <ly-icon name="search" class="absolute right-2.5 top-2 text-dimmed pointer-events-none" />
    </div>
    <div class="md:h-96">
      <div class="flex flex-col gap-2">
        <div
          v-for="tz in timezones"
          :key="tz"
          class="hover:bg-highlight p-3 rounded cursor-pointer flex"
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
