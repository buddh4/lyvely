<script lang="ts" setup>
import { useActivityStore } from '@/modules/activities/store/activity.store';
import { LocationQuery } from 'vue-router';
import CalendarPlanFilterNavigation from '@/modules/calendar-plan/components/CalendarPlanFilterNavigation.vue';

const { filter } = useActivityStore();

function queryHandler(filter: any, query: LocationQuery) {
  delete query.type;
}
</script>

<template>
  <calendar-plan-filter-navigation :filter="filter" @query-handler="queryHandler" />
</template>

<style scoped></style>
