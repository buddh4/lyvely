<script lang="ts" setup>
import { onBeforeMount, onUnmounted, ref } from 'vue';
import { CalendarPlanner, CalendarPlanFilterNavigation } from '@lyvely/calendar-plan-web';
import { t, useContentCreateStore } from '@lyvely/web';
import { JournalModel } from '@lyvely/journals-interface';
import { useJournalPlanStore } from '@/stores';
import JournalCalendarPlanSection from '@/components/calendar-plan/JournalCalendarPlanSection.vue';
import JournalsNavigation from '@/components/menus/JournalsNavigation.vue';
import {
  LyAlert,
  LyButton,
  LyContentPanel,
  LyContentRoot,
  LyFloatingAddButton,
  LyIcon,
} from '@lyvely/ui';

const journalStore = useJournalPlanStore();
const { intervals, filter } = journalStore;

const { isEmpty } = journalStore;

const loaded = ref(false);

onBeforeMount(() => journalStore.loadModels().then(() => (loaded.value = true)));

const createEntry = () => useContentCreateStore().createContentType(JournalModel.contentType);
const unwatch = journalStore.startWatch();
onUnmounted(unwatch);
</script>

<template>
  <ly-content-root>
    <journals-navigation class="md:hidden" />
    <calendar-plan-filter-navigation :filter="filter" />
    <calendar-planner v-if="!isEmpty()">
      <journal-calendar-plan-section
        v-for="interval in intervals"
        :key="interval"
        :interval="interval" />
    </calendar-planner>
    <ly-content-panel v-else-if="loaded">
      <ly-alert class="bg-main cursor-pointer justify-center" @click="createEntry">
        <div class="flex flex-col items-center justify-center">
          <ly-icon name="target" class="w-20 cursor-pointer text-gray-300 dark:text-gray-500" />
          <ly-button class="font-semibold">
            {{ t('journals.calendar-plan.empty') }}
          </ly-button>
        </div>
      </ly-alert>
    </ly-content-panel>

    <ly-floating-add-button @click="createEntry" />
  </ly-content-root>
</template>

<style scoped></style>
