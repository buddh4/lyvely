<script lang="ts" setup>
import ActivityNavigation from '@/modules/activities/components/menus/ActivityNavigation.vue';
import { onMounted } from 'vue';
import { accessibilityFocus } from '@/modules/accessibility/utils/accessibility.util';
import ContentRoot from '@/modules/ui/components/layout/ContentRoot.vue';

onMounted(() => accessibilityFocus('#activity-navigation > button.active'));
</script>

<template>
  <content-root>
    <activity-navigation />
    <router-view></router-view>
  </content-root>
</template>

<style scoped></style>
