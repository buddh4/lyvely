<script lang="ts" setup>
import Button from "@/modules/ui/components/button/Button.vue";
</script>

<template>
  <Button
      class="btn-add fixed bottom-5 right-5 md:bottom-8 md:right-8 cursor-pointer bg-highlight border border-primary z-10 drop-shadow-md shadow-secondary rounded-full w-9 h-9 font-bold text-xl text-center leading-5 text-primary"
      :title="$t('common.create-new')">
    +
  </Button>
</template>

