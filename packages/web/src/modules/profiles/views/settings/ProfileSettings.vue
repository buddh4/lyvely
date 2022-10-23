<script lang="ts" setup>
import ProfileSettingsNavigation from '@/modules/profiles/components/menus/ProfileSettingsNavigation.vue';
</script>

<template>
  <profile-settings-navigation />
  <div id="profile-settings-content">
    <router-view></router-view>
  </div>
</template>

<style scoped></style>
