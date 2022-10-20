<script lang="ts" setup>
import ActivityNavigation from "@/modules/activities/components/menus/ActivityNavigation.vue";
import ActivityFilterNavigation from "@/modules/activities/components/menus/ActivityFilterNavigation.vue";
import { onBeforeMount, onMounted } from "vue";
import { useActivityStore } from "@/modules/activities/store/activity.store";
import { usePageStore } from "@/modules/core/store/page.store";

onBeforeMount(() => useActivityStore().loadActivities());
onMounted(() =>
  usePageStore().accessibilityFocus("#activity-navigation > button.active")
);
</script>

<template>
  <activity-navigation />
  <activity-filter-navigation />
  <router-view></router-view>
</template>

<style scoped></style>
