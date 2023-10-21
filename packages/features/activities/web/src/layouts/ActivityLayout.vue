<script lang="ts" setup>
import { LyContentRoot } from '@lyvely/ui';
import ActivityNavigation from '../components/ActivityNavigation.vue';
import { ProfileLayout, useProfileMenu } from '@lyvely/web';
import { MENU_ACTIVITIES } from '@/activities.constants';
import { computed } from 'vue';

const activitiesMenu = useProfileMenu(MENU_ACTIVITIES);

const showMenu = computed(() => activitiesMenu.enabledMenuEntries.value.length > 1);
</script>

<template>
  <profile-layout>
    <ly-content-root>
      <activity-navigation v-if="showMenu" />
      <slot>
        <router-view></router-view>
      </slot>
    </ly-content-root>
  </profile-layout>
</template>

<style lang="postcss"></style>
