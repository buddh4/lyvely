<script setup lang="ts">
import { getFallbackLocale, t } from '@/i18n';
import { useAccountCalendarPreferencesStore } from '@/user-account/stores/account-calendar-preferences.store';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useAuthStore } from '@/auth';
import { getDefaultCalendarPreferences, getLocalizedDayName } from '@lyvely/dates';
import { LyModal } from '@lyvely/ui';
import {
  USER_SETTING_CALENDAR_PREFERENCE_YEARSTART,
  USER_SETTING_CALENDAR_PREFERENCE_WEEKSTART,
} from '@lyvely/interface';

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const updateCalendarPreferencesStore = useAccountCalendarPreferencesStore();

const { setWeekStart, reset, setYearStart } = updateCalendarPreferencesStore;
const { showWeekStartModal, weekStart, showYearStartModal, yearStart } = storeToRefs(
  updateCalendarPreferencesStore,
);

const weekStartName = computed(() => {
  let { weekStart } = getDefaultCalendarPreferences(user.value!.locale || getFallbackLocale());
  weekStart = authStore.getSetting<number>(USER_SETTING_CALENDAR_PREFERENCE_WEEKSTART, weekStart);
  return getLocalizedDayName(weekStart, 'long', user.value!.locale || getFallbackLocale());
});

const weekStrategy = [
  t('user-account.i18n.week-strategy.0'),
  t('user-account.i18n.week-strategy.1'),
  t('user-account.i18n.week-strategy.2'),
  t('user-account.i18n.week-strategy.3'),
  t('user-account.i18n.week-strategy.4'),
  t('user-account.i18n.week-strategy.5'),
  t('user-account.i18n.week-strategy.6'),
];

const yearStartName = computed(() => {
  let { yearStart } = getDefaultCalendarPreferences(user.value!.locale || getFallbackLocale());
  yearStart = authStore.getSetting<number>(USER_SETTING_CALENDAR_PREFERENCE_YEARSTART, yearStart);
  return weekStrategy[yearStart];
});
</script>

<template>
  <ly-list-page title="user-account.i18n.preferences" class="mb-2">
    <table class="bg-main w-full border-collapse rounded text-sm">
      <tr>
        <th class="w-3/4 p-3 text-left">
          {{ t('user-account.i18n.week-start') }}
        </th>
        <td class="bg-main p-3 text-left">
          <ly-button class="secondary" @click="showWeekStartModal = true">
            {{ weekStartName }}
          </ly-button>
        </td>
      </tr>
      <tr>
        <th class="w-3/4 p-3 text-left">
          <div class="flex flex-col">
            <div>
              {{ t('user-account.i18n.year-start') }}
            </div>
            <ly-dimmed class="text-xs">
              {{ t('user-account.i18n.year-start-info') }}
            </ly-dimmed>
          </div>
        </th>
        <td class="bg-main p-3 text-left">
          <ly-button class="secondary" @click="showYearStartModal = true">
            {{ t(yearStartName) }}
          </ly-button>
        </td>
      </tr>
    </table>
  </ly-list-page>

  <ly-modal
    v-model="showWeekStartModal"
    title="user-account.i18n.week-start"
    @submit="setWeekStart"
    @cancel="reset">
    <div class="flex flex-col gap-2">
      <div
        v-for="(n, i) in 6"
        :key="i"
        class="hover:bg-highlight flex cursor-pointer rounded p-3"
        @click="weekStart = i">
        <div class="flex-grow">
          {{ getLocalizedDayName(i, 'long', user!.locale) }}
        </div>
        <ly-radio v-model="weekStart" :value="i" />
      </div>
    </div>
  </ly-modal>

  <ly-modal
    v-model="showYearStartModal"
    title="user-account.i18n.week-start"
    @submit="setYearStart"
    @cancel="reset">
    <div class="flex flex-col gap-2">
      <div
        v-for="(n, i) in 6"
        :key="i"
        class="hover:bg-highlight flex cursor-pointer rounded p-3"
        @click="yearStart = i">
        <div class="flex-grow">
          {{ weekStrategy[i] }}
        </div>
        <ly-radio v-model="yearStart" :value="i" />
      </div>
    </div>
  </ly-modal>
</template>

<style scoped></style>
