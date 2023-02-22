<script lang="ts" setup></script>

<template>
  <div id="calendar-plan" :aria-label="$t('calendar.plan.aria.root')">
    <slot></slot>
  </div>
</template>

<style lang="postcss">
@import '../styles/calendar-plan.css';
</style>
