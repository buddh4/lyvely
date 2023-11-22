<script setup lang="ts">
import { getFallbackLocale, t } from '@/i18n';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { getDefaultCalendarPreferences, getLocalizedDayName } from '@lyvely/dates';
import { LyModal } from '@lyvely/ui';
import {
  USER_SETTING_CALENDAR_PREFERENCE_YEARSTART,
  USER_SETTING_CALENDAR_PREFERENCE_WEEKSTART,
} from '@lyvely/interface';
import { useProfileCalendarPreferencesStore, useProfileStore } from '@/profiles/stores';

const profileStore = useProfileStore();
const { profile } = storeToRefs(profileStore);
const updateCalendarPreferencesStore = useProfileCalendarPreferencesStore();

const { setWeekStart, reset, setYearStart } = updateCalendarPreferencesStore;
const { showWeekStartModal, weekStart, showYearStartModal, yearStart } = storeToRefs(
  updateCalendarPreferencesStore,
);

const weekStartName = computed(() => {
  let { weekStart } = getDefaultCalendarPreferences(profile.value!.locale || getFallbackLocale());
  weekStart = profileStore.getSetting<number>(
    USER_SETTING_CALENDAR_PREFERENCE_WEEKSTART,
    weekStart,
  );
  return getLocalizedDayName(weekStart, 'long', profile.value!.locale || getFallbackLocale());
});

const weekStrategy = [
  t('profiles.i18n.week-strategy.0'),
  t('profiles.i18n.week-strategy.1'),
  t('profiles.i18n.week-strategy.2'),
  t('profiles.i18n.week-strategy.3'),
  t('profiles.i18n.week-strategy.4'),
  t('profiles.i18n.week-strategy.5'),
  t('profiles.i18n.week-strategy.6'),
];

const yearStartName = computed(() => {
  let { yearStart } = getDefaultCalendarPreferences(profile.value!.locale || getFallbackLocale());
  yearStart = profileStore.getSetting<number>(
    USER_SETTING_CALENDAR_PREFERENCE_YEARSTART,
    yearStart,
  );
  return weekStrategy[yearStart];
});
</script>

<template>
  <ly-list-page title="profiles.i18n.preferences" class="mb-2">
    <table class="border-collapse text-sm w-full bg-main rounded">
      <tr>
        <th class="p-3 text-left w-3/4">
          {{ t('profiles.i18n.week-start') }}
        </th>
        <td class="bg-main p-3 text-left">
          <ly-button class="secondary" @click="showWeekStartModal = true">
            {{ weekStartName }}
          </ly-button>
        </td>
      </tr>
      <tr>
        <th class="p-3 text-left w-3/4">
          <div class="flex flex-col">
            <div>
              {{ t('profiles.i18n.year-start') }}
            </div>
            <ly-dimmed class="text-xs">
              {{ t('profiles.i18n.year-start-info') }}
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
    title="profiles.i18n.week-start"
    @submit="setWeekStart"
    @cancel="reset">
    <div class="flex flex-col gap-2">
      <div
        v-for="(n, i) in 6"
        :key="i"
        class="hover:bg-highlight p-3 rounded cursor-pointer flex"
        @click="weekStart = i">
        <div class="flex-grow">
          {{ getLocalizedDayName(i, 'long', profile!.locale) }}
        </div>
        <ly-radio v-model="weekStart" :value="i" />
      </div>
    </div>
  </ly-modal>

  <ly-modal
    v-model="showYearStartModal"
    title="profiles.i18n.week-start"
    @submit="setYearStart"
    @cancel="reset">
    <div class="flex flex-col gap-2">
      <div
        v-for="(n, i) in 6"
        :key="i"
        class="hover:bg-highlight p-3 rounded cursor-pointer flex"
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
