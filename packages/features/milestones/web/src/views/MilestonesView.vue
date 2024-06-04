<script setup lang="ts">
import MilestonesCalendarPlan from '@/components/calendar-plan/MilestoneCalendarPlan.vue';
import { LyContentRoot } from '@lyvely/ui';
import MilestonesNavigation from '@/components/menus/MilestonesNavigation.vue';
</script>

<template>
  <ly-content-root>
    <milestones-navigation />
    <milestones-calendar-plan />
  </ly-content-root>
</template>

<style scoped></style>
