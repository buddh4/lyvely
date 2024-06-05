<script lang="ts" setup>
import { LyIcon, LyTabMenu, LyTabMenuEntry } from '@lyvely/ui';
import { t } from '@lyvely/web';
import { ROUTES_HABITS_HOME } from '@/habits.constants';
</script>

<template>
  <ly-tab-menu>
    <ly-tab-menu-entry aria-controls="calendar-plan" :to="ROUTES_HABITS_HOME">
      <div class="flex items-center justify-center gap-2">
        <ly-icon name="task" />
        <span>
          {{ t('habits.title') }}
        </span>
      </div>
    </ly-tab-menu-entry>
  </ly-tab-menu>
</template>

<style lang="postcss"></style>
