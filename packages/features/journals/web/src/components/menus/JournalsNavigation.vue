<script lang="ts" setup>
import { LyTabMenu, LyTabMenuEntry } from '@lyvely/ui';
</script>

<template>
  <ly-tab-menu>
    <ly-tab-menu-entry aria-controls="calendar-plan" :to="{ name: 'Journals' }">
      <div class="flex items-center justify-center">
        {{ $t('journals.title') }}
      </div>
    </ly-tab-menu-link>
  </ly-tab-menu>
</template>

<style lang="postcss"></style>
