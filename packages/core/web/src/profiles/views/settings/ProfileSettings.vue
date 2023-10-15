<script lang="ts" setup>
import ProfileSettingsNavigation from '@/profiles/components/menus/ProfileSettingsNavigation.vue';
import { LyContentRoot } from '@lyvely/ui';
</script>

<template>
  <ly-content-root>
    <profile-settings-navigation />
    <div id="profile-settings-content">
      <slot>
        <router-view></router-view>
      </slot>
    </div>
  </ly-content-root>
</template>

<style scoped></style>
