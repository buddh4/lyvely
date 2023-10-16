<script lang="ts" setup>
import { LyContentRoot } from '@lyvely/ui';
import ActivityNavigation from './ActivityNavigation.vue';
</script>

<template>
  <ly-content-root>
    <activity-navigation />
    <slot></slot>
  </ly-content-root>
</template>

<style lang="postcss"></style>
