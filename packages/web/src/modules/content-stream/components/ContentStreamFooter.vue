<script lang="ts" setup>
import ContentStreamFilterNavigation from '@/modules/content-stream/components/ContentStreamFilterNavigation.vue';
import { ProfileType } from '@lyvely/common';
import { useCreateMessageStore } from '@/modules/messages/stores/message.store';
import { storeToRefs } from 'pinia';
import { useProfileStore } from '@/modules/profiles/stores/profile.store';

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

const profileStore = useProfileStore();
const placeholderKey =
  profileStore.profile!.type === ProfileType.User
    ? 'stream.editor.placeholder_single_user'
    : 'stream.editor.placeholder_multi_user';
</script>

<template>
  <div class="p-2 md:p-4 bg-main border-t border-divide">
    <div class="mb-2 md:mb-4 bg">
      <content-stream-filter-navigation />
    </div>
    <div class="flex flex-col">
      <div class="flex gap-1 md:gap-2">
        <ly-button class="primary rounded-full w-10 h-10 flex items-center"
          ><ly-icon name="plus"></ly-icon
        ></ly-button>
        <input
          v-model="model.text"
          type="text"
          class="rounded-full"
          :placeholder="$t(placeholderKey)"
          @keyup.enter="submitMessage" />
        <ly-button class="primary rounded-full w-10 h-10 flex items-center" @click="submitMessage">
          <ly-icon name="send"></ly-icon
        ></ly-button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
