<script lang="ts" setup>
import ContentStreamFilterNavigation from '@/modules/content-stream/components/ContentStreamFilterNavigation.vue';
import ContentStreamEditor from '@/modules/content-stream/components/ContentStreamEditor.vue';
import { MessageModel } from '@lyvely/common';
import { getContentStreamEntryComponent } from '@/modules/content-stream/components/content-stream-entry.registry';

const testMessage = new MessageModel({
  content: {
    text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
  },
  meta: {
    createdAt: new Date(),
  },
});

const stream = [
  testMessage,
  testMessage,
  testMessage,
  /* testMessage,
   testMessage,
   testMessage,
   testMessage,
   testMessage,
   testMessage,
   testMessage,
   testMessage,
   testMessage,
   testMessage,
   testMessage,
   testMessage,
   testMessage,
   testMessage,
   testMessage,
   testMessage,*/
];
</script>

<template>
  <div class="flex h-full items-stretch flex-col-reverse">
    <content-stream-editor />
    <div class="mt-4">
      <content-stream-filter-navigation />
    </div>

    <div class="flex flex-col gap-4 pt-1 overflow-auto scrollbar-thin px-2">
      <template v-for="content in stream">
        <Component :is="getContentStreamEntryComponent(content.type)" :model="content" />
      </template>
    </div>
  </div>
</template>

<style scoped></style>
