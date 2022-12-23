<script lang="ts" setup>
import ContentStreamFilterNavigation from '@/modules/content-stream/components/ContentStreamFilterNavigation.vue';
import ContentStreamEditor from '@/modules/content-stream/components/ContentStreamEditor.vue';
import { storeToRefs } from 'pinia';
import { getContentStreamEntryComponent } from '@/modules/content-stream/components/content-stream-entry.registry';
import { useCreateMessageStore } from '@/modules/messages/stores/message.store';
import { useContentStreamStore } from '@/modules/content-stream/stores/content-stream.store';
import { onMounted, onUnmounted, ref } from 'vue';

const contentStreamStore = useContentStreamStore();
const createMessageStore = useCreateMessageStore();
const { model } = storeToRefs(createMessageStore);
const stream = ref(contentStreamStore.stream);

function submit() {
  createMessageStore.submit();
}

onMounted(() => {
  stream.value.next();
  contentStreamStore.isActive = true;
});

onUnmounted(() => {
  contentStreamStore.isActive = false;
});
</script>

<template>
  <div class="flex h-full items-stretch flex-col-reverse p-0.5 pb-0 pt-1 md:px-6">
    <div class="border border-divide p-4 rounded-t bg-main">
      <div class="mb-4">
        <content-stream-filter-navigation />
      </div>
      <content-stream-editor v-model="model.text" @submit="submit" />
    </div>

    <div class="flex flex-col-reverse gap-2 overflow-auto scrollbar-thin px-2 py-1">
      <div v-if="stream.nextStatus.isStatusInit()">...Loading</div>
      <template v-for="content in stream.models">
        <Component
          :is="getContentStreamEntryComponent(content.type)"
          v-if="getContentStreamEntryComponent(content.type)"
          :model="content" />
      </template>
    </div>
  </div>
</template>

<style scoped></style>
