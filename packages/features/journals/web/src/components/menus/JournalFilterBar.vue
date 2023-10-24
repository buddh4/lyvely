<script lang="ts" setup>
import { useJournalPlanStore } from '@/stores';
import { CalendarPlanFilterNavigation } from '@lyvely/calendar-plan-web';

const { filter } = useJournalPlanStore();
</script>

<template>
  <calendar-plan-filter-navigation :filter="filter" />
</template>

<style scoped></style>
