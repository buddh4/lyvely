<script lang="ts" setup>
import { LyTabMenu, LyIcon, LyTabMenuLink } from '@lyvely/ui';
import { useProfileMenu, t } from '@lyvely/web';
import { MENU_ACTIVITIES } from '@/activities.constants';

const { enabledMenuEntries } = useProfileMenu(MENU_ACTIVITIES);
</script>

<template>
  <ly-tab-menu>
    <ly-tab-menu-link
      v-for="menuEntry in enabledMenuEntries"
      :key="menuEntry.id"
      aria-controls="calendar-plan"
      :to="menuEntry.to">
      <template #default="{ active }">
        <div class="flex gap-1 items-center justify-center">
          <ly-icon :name="menuEntry.icon" :class="[{ hidden: active }, 'md:hidden h-3']" />
          <span :class="!active ? 'hidden md:inline' : ''">
            {{ t(menuEntry.text) }}
          </span>
        </div>
      </template>
    </ly-tab-menu-link>
  </ly-tab-menu>
</template>

<style lang="postcss"></style>
