<script setup lang="ts">
import { getFallbackLocale, t, useI18nStore } from '@/i18n';
import { useUpdateAccountCalendarPreferencesStore } from '@/user-accounts/stores/update-calendar-preferences.store';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useAuthStore } from '@/auth';
import { getDefaultCalendarPreferences, getLocalizedDayName } from '@lyvely/dates';
import { LyModal } from '@lyvely/ui';

const { user } = storeToRefs(useAuthStore());
const updateCalendarPreferencesStore = useUpdateAccountCalendarPreferencesStore();

const { setWeekStart, reset } = updateCalendarPreferencesStore;
const { showWeekStartModal, weekStart } = storeToRefs(updateCalendarPreferencesStore);

const weekStartName = computed(() => {
  const defaultPreferences = getDefaultCalendarPreferences(
    user.value!.locale || getFallbackLocale(),
  );
  const currentWeekStart =
    user.value!.settings?.calendar?.weekStart ?? defaultPreferences.weekStart;

  return getLocalizedDayName(currentWeekStart, 'long', user.value!.locale || getFallbackLocale());
});
</script>

<template>
  <ly-list-page title="user-accounts.i18n.preferences" class="mb-2">
    <table class="border-collapse text-sm w-full bg-main rounded">
      <tr>
        <th class="p-3 text-left w-3/4">
          {{ t('user-accounts.i18n.week-start') }}
        </th>
        <td class="bg-main p-3 text-left">
          <ly-button class="secondary" @click="showWeekStartModal = true">
            {{ weekStartName }}
          </ly-button>
        </td>
      </tr>
    </table>
  </ly-list-page>

  <ly-modal
    v-model="showWeekStartModal"
    title="user-accounts.i18n.week-start"
    @submit="setWeekStart"
    @cancel="reset">
    <div class="flex flex-col gap-2">
      <div
        v-for="(n, i) in 6"
        :key="i"
        class="hover:bg-highlight p-3 rounded cursor-pointer flex"
        @click="weekStart = i">
        <div class="flex-grow">
          {{ getLocalizedDayName(i, 'long', user!.locale) }}
        </div>
        <ly-radio v-model="weekStart" :value="i" />
      </div>
    </div>
  </ly-modal>
</template>

<style scoped></style>
