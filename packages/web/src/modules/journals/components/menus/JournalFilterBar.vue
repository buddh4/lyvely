<script lang="ts" setup>
import { useJournalPlanStore } from '@/modules/journals/stores/journal-calendar-plan.store';

const { filter } = useJournalPlanStore();
</script>

<template>
  <calendar-plan-filter-navigation :filter="filter" />
</template>

<style scoped></style>
