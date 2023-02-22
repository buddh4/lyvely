<script lang="ts" setup>
import { onBeforeMount, onUnmounted } from 'vue';
import ContentRoot from '@/modules/ui/components/layout/ContentRoot.vue';
import CalendarPlan from '@/modules/calendar-plan/components/CalendarPlan.vue';
import { useContentCreateStore } from '@/modules/content/stores/content-create.store';
import FloatingAddButton from '@/modules/ui/components/button/FloatingAddButton.vue';
import { JournalModel } from '@lyvely/common';
import { useJournalPlanStore } from '@/modules/journals/stores/journal-plan.store';
import JournalCalendarPlanSection from '@/modules/journals/components/JournalCalendarPlanSection.vue';

const journalStore = useJournalPlanStore();
const { intervals } = journalStore;

onBeforeMount(() => journalStore.loadModels());
//onMounted(() => accessibilityFocus('#activity-navigation > button.active'));

const createEntry = () => useContentCreateStore().createContentType(JournalModel.contentType);
const unwatch = journalStore.startWatch();
onUnmounted(unwatch);
</script>

<template>
  <content-root>
    <calendar-plan>
      <journal-calendar-plan-section
        v-for="interval in intervals"
        :key="interval"
        :interval="interval" />
    </calendar-plan>

    <floating-add-button @click="createEntry" />
  </content-root>
</template>

<style scoped></style>
