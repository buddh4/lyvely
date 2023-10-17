<script lang="ts" setup>
import { LyTabMenu, LyIcon, LyTabMenuLink } from '@lyvely/ui';
import { useProfileMenu, t } from '@lyvely/web';
import { ACTIVITIES_MENU } from '@/activities.constants';

const { enabledMenuEntries } = useProfileMenu(ACTIVITIES_MENU);
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
          <ly-icon name="activity" :class="[{ hidden: active }, 'md:hidden h-3']" />
          <span :class="!active ? 'hidden md:inline' : ''">
            {{ t(menuEntry.title) }}
          </span>
        </div>
      </template>
    </ly-tab-menu-link>
  </ly-tab-menu>
</template>

<style lang="postcss"></style>
