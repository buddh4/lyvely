<script setup lang="ts">
import TaskCalendarPlan from '@/components/calendar-plan/TaskCalendarPlan.vue';
import { LyContentRoot } from '@lyvely/ui';
import TasksNavigation from '@/components/menu/TasksNavigation.vue';
</script>

<template>
  <ly-content-root>
    <tasks-navigation />
    <task-calendar-plan />
  </ly-content-root>
</template>

<style scoped></style>
