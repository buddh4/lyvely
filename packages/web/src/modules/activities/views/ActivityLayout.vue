<script lang="ts" setup>
import ActivityNavigation from '@/modules/activities/components/menus/ActivityNavigation.vue';
import ActivityFilterNavigation from '@/modules/activities/components/menus/ActivityFilterNavigation.vue';
import { onBeforeMount, onMounted, onUnmounted } from 'vue';
import { useActivityStore } from '@/modules/activities/store/activity.store';
import { accessibilityFocus } from '@/modules/accessibility/utils/accessibility.util';
import ContentRoot from '@/modules/ui/components/layout/ContentRoot.vue';

onBeforeMount(() => useActivityStore().loadModels());
onMounted(() => accessibilityFocus('#activity-navigation > button.active'));
const unwatch = useActivityStore().startWatch();
onUnmounted(unwatch);
</script>

<template>
  <content-root>
    <activity-navigation />
    <activity-filter-navigation />
    <router-view></router-view>
  </content-root>
</template>

<style scoped></style>
