<script lang="ts" setup>
import ContentStreamMessageInput from '@/modules/content-stream/components/ContentStreamMessageInput.vue';
import ContentStream from '@/modules/content-stream/components/ContentStream.vue';
</script>

<template>
  <div class="h-full flex flex-col-reverse items-stretch">
    <div
      class="max-h-full flex items-stretch flex-col-reverse items-stretch p-0.5 pb-0 pt-1 md:px-6 h-full">
      <content-stream-message-input />
      <content-stream />
    </div>
  </div>
</template>

<style scoped></style>
