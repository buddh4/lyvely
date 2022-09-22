<script lang="ts" setup>
import ActivityNavigation from "@/modules/activity/components/ActivityNavigation.vue";
import ActivityFilterNavigation from "@/modules/activity/components/ActivityFilterNavigation.vue";
import { onBeforeMount, onMounted } from 'vue';
import { useActivityStore } from '@/modules/activity/store/activityStore';
import { usePageStore } from "@/modules/core/store/page.store";

onBeforeMount(() => useActivityStore().loadActivities());
onMounted(() => usePageStore().accessibilityFocus('#activity-navigation > button.active'));
</script>

<template>
  <ActivityNavigation />
  <ActivityFilterNavigation />
  <router-view></router-view>
</template>

<style scoped></style>
