<script lang="ts" setup>
import ContentStreamFilterNavigation from '@/modules/content-stream/components/ContentStreamFilterNavigation.vue';
import ContentStreamEditor from '@/modules/content-stream/components/ContentStreamEditor.vue';
import { useCreateMessageStore } from '@/modules/messages/stores/message.store';
import { storeToRefs } from 'pinia';

export interface IProps {
  parentId?: string;
}

const props = defineProps<IProps>();
const emits = defineEmits(['contentCreated']);

const createMessageStore = useCreateMessageStore();
const { model } = storeToRefs(createMessageStore);

async function submitMessage() {
  const newMessage = await createMessageStore.submit(props.parentId);
  emits('contentCreated', newMessage);
}
</script>

<template>
  <div class="p-2 md:p-4 bg-main border-t border-divide">
    <div class="mb-2 md:mb-4 bg">
      <content-stream-filter-navigation />
    </div>
    <content-stream-editor v-model="model.text" @submit="submitMessage" />
  </div>
</template>

<style scoped></style>
