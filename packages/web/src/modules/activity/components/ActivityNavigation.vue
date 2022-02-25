<script lang="ts" setup>
import Button from '@/modules/ui/components/button/Button.vue';
</script>

<template>
  <div id="sub-nav" class="flex justify-center md:mx-2 text-sm">
    <div class="button-group flex flex-inline btn-group max-w-md w-full mb-2" role="group" aria-label="Activity Navigation">
      <Button :route="{ name: 'Habits'}" class="secondary outlined grow px-1 py-1" >
        Activities
      </Button>
      <Button :route="{ name: 'Tasks'}" class="secondary outlined grow px-1 py-1">
        Tasks
      </Button>
      <!--Button :route="{ name: 'Goals'}" class="secondary outline rounded-r grow px-1 py-1">
        Goals
      </Button -->
    </div>
  </div>
</template>

<style lang="postcss"></style>
