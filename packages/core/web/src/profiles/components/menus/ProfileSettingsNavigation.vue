<script lang="ts" setup>
import { getMenuEntries } from '@/menus';
import { MENU_PROFILE_SETTINGS } from '@/profiles/profile.constants';
import { computed } from 'vue';
import { isFeatureEnabledOnProfile } from '@/features';
import { sortBySortOrder } from '@lyvely/common';

const allMenuEntries = getMenuEntries(MENU_PROFILE_SETTINGS);
const filteredMenuEntries = computed(() => {
  return [...allMenuEntries.value]
    .filter((entry) => !entry.feature || isFeatureEnabledOnProfile(entry.feature))
    .sort(sortBySortOrder);
});
</script>

<template>
  <ly-tab-menu id="sub-nav" class="flex justify-center md:mx-2 text-sm pb-2 md:pb-5">
    <ly-tab-menu-link
      v-for="menuEntry in filteredMenuEntries"
      :key="menuEntry.id"
      aria-controls="profile-settings-content"
      :to="menuEntry.to!"
      :label="menuEntry.title" />
  </ly-tab-menu>
</template>

<style lang="postcss"></style>
