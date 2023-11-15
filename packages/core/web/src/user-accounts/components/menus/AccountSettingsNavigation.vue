<script lang="ts" setup>
import { LyTabMenu, LyTabMenuEntry, useMenu } from '@lyvely/ui';
import { MENU_ACCOUNT_SETTINGS } from '@/user-accounts';
import { toValue } from 'vue';

const { enabledMenuEntries } = useMenu(MENU_ACCOUNT_SETTINGS);
</script>

<template>
  <ly-tab-menu>
    <ly-tab-menu-entry
      v-for="menuEntry in enabledMenuEntries"
      :key="menuEntry.id"
      aria-controls="calendar-plan"
      :label="toValue(menuEntry.text)"
      :to="menuEntry.to!" />
  </ly-tab-menu>
</template>

<style lang="postcss"></style>
