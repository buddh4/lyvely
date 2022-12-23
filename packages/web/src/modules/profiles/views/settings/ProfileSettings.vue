<script lang="ts" setup>
import ProfileSettingsNavigation from '@/modules/profiles/components/menus/ProfileSettingsNavigation.vue';
import ContentRoot from '@/modules/ui/components/layout/ContentRoot.vue';
</script>

<template>
  <content-root>
    <profile-settings-navigation />
    <div id="profile-settings-content">
      <router-view></router-view>
    </div>
  </content-root>
</template>

<style scoped></style>
