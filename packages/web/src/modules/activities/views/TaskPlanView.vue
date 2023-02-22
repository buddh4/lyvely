<script lang="ts" setup>
import ActivityPlanList from '@/modules/activities/components/ActivityCalendarPlanSection.vue';
import CalendarPlan from '@/modules/calendar-plan/components/CalendarPlan.vue';
import { ActivityType, getCalendarIntervalArray } from '@lyvely/common';
import { usePageStore } from '@/modules/core/store/page.store';
import FloatingAddButton from '@/modules/ui/components/button/FloatingAddButton.vue';
import { useContentCreateStore } from '@/modules/content/stores/content-create.store';

const type = ActivityType.Task;
const createEntry = () => useContentCreateStore().createContentType(type);

const intervals = getCalendarIntervalArray();

usePageStore().setTitle(['Tasks']);
</script>

<template>
  <calendar-plan>
    <activity-plan-list
      v-for="interval in intervals"
      :key="interval"
      :interval="interval"
      :type="type" />
  </calendar-plan>

  <floating-add-button @click="createEntry" />
</template>
