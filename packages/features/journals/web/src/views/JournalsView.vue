<script lang="ts" setup>
import JournalsNavigation from '@/components/menus/JournalsNavigation.vue';
import { LyContentRoot } from '@lyvely/ui';
import JournalCalendarPlan from '@/components/calendar-plan/JournalCalendarPlan.vue';
</script>

<template>
  <ly-content-root>
    <journals-navigation class="md:hidden" />
    <journal-calendar-plan />
  </ly-content-root>
</template>

<style scoped></style>
