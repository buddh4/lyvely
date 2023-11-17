<script lang="ts" setup>
import { t } from '@lyvely/web';
</script>

<template>
  <div id="calendar-plan" :aria-label="t('calendar-plan.aria.root')">
    <slot></slot>
  </div>
</template>

<style lang="postcss">
#calendar-plan {
  @apply flex flex-col p-0 rounded;
}

.calendar-plan-item {
  @apply py-2 px-3;
}

#calendar-plan-unscheduled[data-count='0'] {
  @apply rounded-b border-b;
}

#calendar-plan-unscheduled[data-count='0']
  + [data-calendar-plan-item-container]
  .calendar-plan-items {
  @apply border-none;
}

#calendar-plan-items-unscheduled .calendar-plan-items {
  @apply rounded-b border-b border-divide;
}

.calendar-plan-title {
  @apply inline-block my-0 cursor-pointer;
  min-width: 110px;
}
</style>
