<script lang="ts" setup>
import ProfileSettingsNavigation from '@/modules/profiles/components/menus/ProfileSettingsNavigation.vue';
import { LyContentRoot } from '@lyvely/ui';
</script>

<template>
  <ly-content-root>
    <profile-settings-navigation />
    <div id="profile-settings-content">
      <router-view></router-view>
    </div>
  </ly-content-root>
</template>

<style scoped></style>
