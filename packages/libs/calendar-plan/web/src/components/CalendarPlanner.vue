<script lang="ts" setup>
import { t } from '@lyvely/web';
</script>

<template>
  <div
    id="calendar-plan"
    class="flex flex-col p-0 rounded"
    :aria-label="t('calendar-plan.aria.root')">
    <slot></slot>
  </div>
</template>
