<script lang="ts" setup>
import { useProfileMenu } from '@/profiles/composables';
import { MENU_PROFILE_SETTINGS } from '@/profiles/profile.constants';
import { LyTabMenuEntry } from '@lyvely/ui';

const { enabledMenuEntries } = useProfileMenu(MENU_PROFILE_SETTINGS);
</script>

<template>
  <div class="flex gap-1 md:mx-2 text-xs md:text-sm pb-2 md:pb-5 overflow-auto">
    <ly-tab-menu-entry
      v-for="menuEntry in enabledMenuEntries"
      :key="menuEntry.id"
      :entry="menuEntry"
      aria-controls="profile-settings-content" />
  </div>
</template>

<style lang="postcss"></style>
