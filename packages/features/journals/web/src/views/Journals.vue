<script lang="ts" setup>
import { onBeforeMount, onUnmounted } from 'vue';
import CalendarPlan from '@/calendar-plan/components/CalendarPlan.vue';
import { useContentCreateStore } from '@/content/stores/content-create.store';
import { JournalModel } from '@lyvely/journals-interface';
import { useJournalPlanStore } from '@/journals/stores/journal-calendar-plan.store';
import JournalCalendarPlanSection from '@/journals/components/JournalCalendarPlanSection.vue';
import CalendarPlanFilterNavigation from '@/calendar-plan/components/CalendarPlanFilterNavigation.vue';
import JournalsNavigation from '@/journals/components/menus/JournalsNavigation.vue';
import { LyContentRoot } from '@lyvely/ui';

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
    <calendar-plan>
      <journal-calendar-plan-section
        v-for="interval in intervals"
        :key="interval"
        :interval="interval" />
    </calendar-plan>

    <ly-floating-add-button @click="createEntry" />
  </ly-content-root>
</template>

<style scoped></style>
