<script lang="ts" setup>
import LyButton from "@/modules/ui/components/button/StyledButton.vue";
</script>

<template>
  <div id="sub-nav" class="flex justify-center md:mx-2 text-sm pb-2 md:pb-5">
    <div
      id="activity-navigation"
      class="button-group flex flex-inline btn-group max-w-md w-full"
      role="tablist"
      aria-label="Activity Navigation"
    >
      <ly-button
        :route="{ name: 'Habits' }"
        role="tab"
        aria-controls="calendar-plan"
        class="secondary outlined grow px-1 py-1"
      >
        Activities
      </ly-button>
      <ly-button
        :route="{ name: 'Tasks' }"
        role="tab"
        aria-controls="calendar-plan"
        class="secondary outlined grow px-1 py-1"
      >
        Tasks
      </ly-button>
    </div>
  </div>
</template>

<style lang="postcss"></style>
