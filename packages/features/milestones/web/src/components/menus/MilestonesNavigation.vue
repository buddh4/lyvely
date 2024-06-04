<script lang="ts" setup>
import { LyIcon, LyTabMenu, LyTabMenuEntry } from '@lyvely/ui';
import { t } from '@lyvely/web';
</script>

<template>
  <ly-tab-menu>
    <ly-tab-menu-entry aria-controls="calendar-plan" :to="{ name: 'Milestones' }">
      <div class="flex items-center justify-center gap-2">
        <ly-icon name="target" />
        <span>
          {{ t('milestones.title') }}
        </span>
      </div>
    </ly-tab-menu-entry>
  </ly-tab-menu>
</template>

<style lang="postcss"></style>
