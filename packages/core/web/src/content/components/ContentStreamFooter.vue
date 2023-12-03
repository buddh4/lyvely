<script lang="ts" setup>
import ContentStreamFilterNavigation from './ContentStreamFilterNavigation.vue';
import { ProfileType, ContentModel, CreateMessagePermission } from '@lyvely/interface';
import { useCreateMessageStore } from '@/messages/stores/message.store';
import { storeToRefs } from 'pinia';
import { useProfileStore } from '@/profiles/stores/profile.store';
import { onMounted, ref } from 'vue';
import { useContentStreamFilterStore, useContentCreateStore } from '../stores';
import { focusIfNotTouchScreen } from '@lyvely/ui';
import { usePermissions } from '@/common';

export interface IProps {
  parent?: ContentModel;
}

const props = defineProps<IProps>();

const { filter } = storeToRefs(useContentStreamFilterStore());
const emits = defineEmits(['contentCreated']);

const messageInput = ref<HTMLTextAreaElement>();

const createMessageStore = useCreateMessageStore();
const { model } = storeToRefs(createMessageStore);

const { isAllowed: canCreateMessage } = usePermissions(CreateMessagePermission);

async function submitMessage(evt: KeyboardEvent) {
  if (!evt?.shiftKey) {
    const newMessage = await createMessageStore.submit(filter.value.parentId);
    emits('contentCreated', newMessage);
    messageInput.value!.style.height = 'auto';
  }
}

async function openCreateContentModal() {
  const tagNames = useProfileStore().tagIdsToNames(useContentStreamFilterStore().filter.tagIds);
  useContentCreateStore().createAnyContent({
    title: model.value.text,
    tagNames,
    parentId: props.parent?.id,
  });
  model.value.text = '';
}

const profileStore = useProfileStore();
const placeholderKey =
  profileStore.profile!.type === ProfileType.User
    ? 'stream.editor.placeholder_single_user'
    : 'stream.editor.placeholder_multi_user';

const onInputKeydown = (evt: KeyboardEvent) => {
  if (evt.ctrlKey && evt.key === '+') {
    evt.preventDefault();
    openCreateContentModal();
  } else if (evt.key === 'Enter' && !evt.shiftKey) {
    evt.preventDefault();
  }
};

function autoAlignHeight() {
  setTimeout(() => {
    const textarea = messageInput.value!;
    if (textarea.offsetHeight < 350 || textarea.offsetHeight > textarea.scrollHeight) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 350) + 'px';
    }
  });
}

onMounted(() => {
  focusIfNotTouchScreen(messageInput.value);
  messageInput.value?.addEventListener('input', () => autoAlignHeight());
});
</script>

<template>
  <div class="p-2 md:p-4 bg-main">
    <div>
      <content-stream-filter-navigation />
    </div>
    <div v-if="canCreateMessage" class="flex flex-col mt-2 md:mt-4">
      <div class="flex gap-1 md:gap-3 items-end">
        <ly-button
          data-id="btn-stream-add"
          class="primary rounded-full w-10 h-10 flex items-center"
          @click="openCreateContentModal">
          <ly-icon name="plus"></ly-icon>
        </ly-button>

        <div
          class="flex flex-grow relative bg-gray-100 dark:bg-highlight rounded-3xl px-3.5 py-2 overflow-hidden">
          <textarea
            ref="messageInput"
            v-model.trim="model.text"
            data-id="stream-input"
            rows="1"
            type="text"
            class="plain w-full bg-transparent resize-none overflow-auto disabled:cursor-pointer scrollbar-thin border-0 p-0 focus-hidden focus:ring-none focus:outline-none focus:shadow-none"
            :placeholder="$t(placeholderKey)"
            @keyup.enter="submitMessage"
            @keydown="onInputKeydown"
            @paste="autoAlignHeight" />
        </div>

        <ly-button
          class="primary rounded-full w-10 h-10 flex items-center"
          data-id="btn-stream-submit"
          @click="submitMessage">
          <ly-icon name="send"></ly-icon>
        </ly-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-input {
  box-shadow: none;
}
</style>
