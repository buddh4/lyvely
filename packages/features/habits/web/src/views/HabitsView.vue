<script setup lang="ts">
import HabitCalendarPlan from '@/components/calendar-plan/HabitCalendarPlan.vue';
import { LyContentRoot } from '@lyvely/ui';
import { ContentPicker } from '@lyvely/web';
import HabitsNavigation from '@/components/menu/HabitsNavigation.vue';
</script>

<template>
  <ly-content-root>
    <content-picker />
    <habits-navigation class="md:hidden" />
    <habit-calendar-plan />
  </ly-content-root>
</template>

<style scoped></style>
