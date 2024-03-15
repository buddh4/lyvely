<script lang="ts" setup>
import { LyTabMenu, LyIcon, LyTabMenuEntry } from '@lyvely/ui';
import { useProfileMenu, t } from '@lyvely/web';
import { MENU_ACTIVITIES } from '@/activities.constants';
import { isPlainObject } from '@lyvely/common';

let { enabledMenuEntries } = useProfileMenu(MENU_ACTIVITIES);
</script>

<template>
  <ly-tab-menu>
    <ly-tab-menu-entry
      v-for="entry in enabledMenuEntries"
      :key="entry.id"
      aria-controls="calendar-plan"
      :to="entry.to!">
      <template #default="{ active }">
        <div class="flex gap-1 items-center justify-center">
          <ly-icon v-if="typeof entry.icon === 'string'" :name="entry.icon" />
          <ly-icon v-else-if="isPlainObject(entry.iconBindings)" v-bind="entry.iconBindings" />
          <span :class="!active ? 'hidden md:inline' : ''">
            {{ t(entry.text) }}
          </span>
        </div>
      </template>
    </ly-tab-menu-entry>
  </ly-tab-menu>
</template>

<style lang="postcss"></style>
