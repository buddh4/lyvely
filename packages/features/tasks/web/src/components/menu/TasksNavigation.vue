<script lang="ts" setup>
import { LyIcon, LyTabMenu, LyTabMenuEntry } from '@lyvely/ui';
import { t } from '@lyvely/web';
</script>

<template>
  <ly-tab-menu>
    <ly-tab-menu-entry aria-controls="calendar-plan" :to="{ name: 'Tasks' }">
      <div class="flex items-center justify-center gap-2">
        <ly-icon name="task" />
        <span>
          {{ t('tasks.title') }}
        </span>
      </div>
    </ly-tab-menu-entry>
  </ly-tab-menu>
</template>

<style lang="postcss"></style>
