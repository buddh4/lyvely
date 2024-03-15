<script lang="ts" setup>
import { LyTabMenu, LyTabMenuEntry } from '@lyvely/ui';
import { t } from '@lyvely/web';
</script>

<template>
  <ly-tab-menu>
    <ly-tab-menu-entry aria-controls="calendar-plan" :to="{ name: 'Journals' }">
      <div class="flex items-center justify-center">
        {{ t('journals.title') }}
      </div>
    </ly-tab-menu-entry>
  </ly-tab-menu>
</template>

<style lang="postcss"></style>
