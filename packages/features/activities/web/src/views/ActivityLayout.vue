<script lang="ts" setup>
import ActivityNavigation from '@/modules/activities/components/menus/ActivityNavigation.vue';
import { onMounted } from 'vue';
import { accessibilityFocus } from '@/modules/accessibility/utils/accessibility.util';
import { LyContentRoot } from '@lyvely/ui';

onMounted(() => accessibilityFocus('#activity-navigation > button.active'));
</script>

<template>
  <ly-content-root>
    <activity-navigation />
    <router-view></router-view>
  </ly-content-root>
</template>

<style scoped></style>
