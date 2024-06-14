<script setup lang="ts">
import { LyAlert, LyContentPanel, LyFloatingAddButton, LyIcon } from '@lyvely/ui';
import JournalCalendarPlanSection from '@/components/calendar-plan/JournalCalendarPlanSection.vue';
import { useJournalPermissions } from '@lyvely/journals-interface';
import { t, useProfilePermissions } from '@lyvely/web';
import { useJournalPlanStore } from '@/stores';
import { onBeforeMount, onUnmounted, ref } from 'vue';
import { CalendarPlanFilterNavigation, CalendarPlanner } from '@lyvely/calendar-plan-web';

const journalStore = useJournalPlanStore();
const { intervals, filter, createItem, reset } = journalStore;

const { isEmpty } = journalStore;

const loaded = ref(false);

const { isAllowed: canCreateJournal } = useProfilePermissions(useJournalPermissions().Create);

const createJournal = () => {
  if (!canCreateJournal.value) return;
  createItem();
};

onBeforeMount(() => journalStore.loadModels().then(() => (loaded.value = true)));
const unwatch = journalStore.startWatch();
onUnmounted(() => {
  unwatch();
  reset();
});
</script>

<template>
  <calendar-plan-filter-navigation :filter="filter" />
  <calendar-planner v-if="!isEmpty()">
    <journal-calendar-plan-section
      v-for="interval in intervals"
      :key="interval"
      :interval="interval" />
  </calendar-planner>
  <ly-content-panel v-else-if="loaded">
    <ly-alert
      :class="[{ 'cursor-pointer': canCreateJournal }, 'justify-center bg-main']"
      :role="canCreateJournal ? 'button' : ''"
      @click="createJournal">
      <div class="flex flex-col items-center justify-center">
        <ly-icon name="journal" class="w-20 text-gray-300 dark:text-gray-500" />
        <span v-if="canCreateJournal" class="font-semibold">{{
          t('journals.calendar-plan.empty-create')
        }}</span>
        <span v-else class="font-semibold">{{ t('journals.calendar-plan.empty') }}</span>
      </div>
    </ly-alert>
  </ly-content-panel>

  <ly-floating-add-button v-if="canCreateJournal" @click="createItem" />
</template>

<style scoped></style>
