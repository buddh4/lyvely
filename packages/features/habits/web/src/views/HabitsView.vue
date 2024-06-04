<script setup lang="ts">
import HabitCalendarPlan from '@/components/calendar-plan/HabitCalendarPlan.vue';
import { LyContentRoot } from '@lyvely/ui';
import HabitsNavigation from '@/components/menu/HabitsNavigation.vue';
</script>

<template>
  <ly-content-root>
    <habits-navigation />
    <habit-calendar-plan />
  </ly-content-root>
</template>

<style scoped></style>
