<script lang="ts" setup>
import { onBeforeMount, onUnmounted } from 'vue';
import { CalendarPlanner, CalendarPlanFilterNavigation } from '@lyvely/calendar-plan-web';
import { useContentCreateStore } from '@lyvely/web';
import { JournalModel } from '@lyvely/journals-interface';
import { useJournalPlanStore } from '@/stores';
import JournalCalendarPlanSection from '@/components/calendar-plan/JournalCalendarPlanSection.vue';
import JournalsNavigation from '@/components/menus/JournalsNavigation.vue';
import { LyContentRoot, LyFloatingAddButton } from '@lyvely/ui';

const journalStore = useJournalPlanStore();
const { intervals, filter } = journalStore;

onBeforeMount(() => journalStore.loadModels());
//onMounted(() => accessibilityFocus('#activity-navigation > button.active'));

const createEntry = () => useContentCreateStore().createContentType(JournalModel.contentType);
const unwatch = journalStore.startWatch();
onUnmounted(unwatch);
</script>

<template>
  <ly-content-root>
    <journals-navigation class="md:hidden" />
    <calendar-plan-filter-navigation :filter="filter" />
    <calendar-planner>
      <journal-calendar-plan-section
        v-for="interval in intervals"
        :key="interval"
        :interval="interval" />
    </calendar-planner>

    <ly-floating-add-button @click="createEntry" />
  </ly-content-root>
</template>

<style scoped></style>
