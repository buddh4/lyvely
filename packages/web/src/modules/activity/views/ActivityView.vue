<script lang="ts" setup>
import ActivityNavigation from "@/modules/activity/components/ActivityNavigation.vue";
import ActivityFilterNavigation from "@/modules/activity/components/ActivityFilterNavigation.vue";
import { onBeforeMount, onMounted } from 'vue';
import { useActivityStore } from '@/modules/activity/store/activityStore';
import MainContainer from '@/modules/ui/components/layout/MainContainer.vue';
import { usePageStore } from "@/modules/core/store/page.store";

onBeforeMount(() => useActivityStore().loadActivities());
onMounted(() => usePageStore().accessibilityFocus('#activity-navigation > button.active'));
</script>

<template>
  <MainContainer id="activity-overview">
    <ActivityNavigation />
    <ActivityFilterNavigation />
    <router-view></router-view>
  </MainContainer>
</template>

<style scoped></style>
