<script lang="ts" setup>
import ContentStreamFilterNavigation from '@/modules/content-stream/components/ContentStreamFilterNavigation.vue';
import ContentStreamEditor from '@/modules/content-stream/components/ContentStreamEditor.vue';
import { useCreateMessageStore } from '@/modules/messages/stores/message.store';
import { storeToRefs } from 'pinia';

const createMessageStore = useCreateMessageStore();
const { model } = storeToRefs(createMessageStore);

function submitMessage() {
  createMessageStore.submit();
}
</script>

<template>
  <div class="p-4 rounded-t bg-body">
    <div class="mb-4 bg">
      <content-stream-filter-navigation />
    </div>
    <content-stream-editor v-model="model.text" @submit="submitMessage" />
  </div>
</template>

<style scoped></style>
