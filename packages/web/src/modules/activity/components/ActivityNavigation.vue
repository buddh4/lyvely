<script lang="ts" setup>
import Button from '@/modules/ui/components/button/Button.vue';
</script>

<template>
  <div id="sub-nav" class="flex justify-center md:mx-2 text-sm pb-2 md:pb-5">
    <div id="activity-navigation" class="button-group flex flex-inline btn-group max-w-md w-full" role="tablist" aria-label="Activity Navigation">
      <Button :route="{ name: 'Habits' }" role="tab" aria-controls="calendar-plan" class="secondary outlined grow px-1 py-1">
        Activities
      </Button>
      <Button :route="{ name: 'Tasks'}" role="tab" aria-controls="calendar-plan" class="secondary outlined grow px-1 py-1">
        Tasks
      </Button>
    </div>
  </div>
</template>

<style lang="postcss"></style>
