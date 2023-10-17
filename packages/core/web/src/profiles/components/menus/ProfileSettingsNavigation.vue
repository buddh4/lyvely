<script lang="ts" setup>
import { useProfileMenu } from '@/profiles/composables';
import { MENU_PROFILE_SETTINGS } from '@/profiles/profile.constants';
import { LyTabMenuLink } from '@lyvely/ui';

const { enabledMenuEntries } = useProfileMenu(MENU_PROFILE_SETTINGS);
</script>

<template>
  <ly-tab-menu id="sub-nav" class="flex justify-center md:mx-2 text-sm pb-2 md:pb-5">
    <ly-tab-menu-link
      v-for="menuEntry in enabledMenuEntries"
      :key="menuEntry.id"
      aria-controls="profile-settings-content"
      :to="menuEntry.to!"
      :label="menuEntry.title" />
  </ly-tab-menu>
</template>

<style lang="postcss"></style>
