<script lang="ts" setup>
import { LyContentRoot } from '@lyvely/ui';
import ActivityNavigation from '../components/ActivityNavigation.vue';
import { ProfileLayout, useProfileMenu } from '@lyvely/web';
import { ACTIVITIES_MENU } from '@/activities.constants';
import { computed } from 'vue';

const activitiesMenu = useProfileMenu(ACTIVITIES_MENU);

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
