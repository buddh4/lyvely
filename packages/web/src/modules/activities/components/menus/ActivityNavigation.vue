<script lang="ts" setup></script>

<template>
  <ly-tab-menu>
    <ly-tab-menu-link aria-controls="calendar-plan" :route="{ name: 'Habits' }" label-key="activities.habits.title" />
    <ly-tab-menu-link aria-controls="calendar-plan" :route="{ name: 'Tasks' }" label-key="activities.tasks.title" />
  </ly-tab-menu>
</template>

<style lang="postcss"></style>
