<script lang="ts" setup>
import { t } from '@lyvely/web';
</script>

<template>
  <div
    id="calendar-plan"
    class="flex flex-col rounded p-0"
    :aria-label="t('calendar-plan.aria.root')">
    <slot></slot>
  </div>
</template>
