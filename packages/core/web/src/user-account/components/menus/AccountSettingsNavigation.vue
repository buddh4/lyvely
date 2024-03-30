<script lang="ts" setup>
import { LyTabMenu, LyTabMenuEntry, useMenu } from '@lyvely/ui';
import { MENU_ACCOUNT_SETTINGS } from '@/user-account';

const { enabledMenuEntries } = useMenu(MENU_ACCOUNT_SETTINGS);
</script>

<template>
  <ly-tab-menu>
    <ly-tab-menu-entry
      v-for="menuEntry in enabledMenuEntries"
      :key="menuEntry.id"
      :entry="menuEntry"
      aria-controls="calendar-plan" />
  </ly-tab-menu>
</template>

<style lang="postcss"></style>
