<script lang="ts" setup>
import { LyContentRoot } from '@lyvely/ui';
import ActivityNavigation from '../components/ActivityNavigation.vue';
import { ProfileLayout, useProfileMenu } from '@lyvely/web';
import { MENU_ACTIVITIES } from '@/activities.constants';

const { hasEnabledEntries } = useProfileMenu(MENU_ACTIVITIES);
</script>

<template>
  <profile-layout>
    <ly-content-root>
      <activity-navigation v-if="hasEnabledEntries" />
      <slot>
        <router-view></router-view>
      </slot>
    </ly-content-root>
  </profile-layout>
</template>

<style lang="postcss"></style>
