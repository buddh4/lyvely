<script lang="ts" setup>
import ContentStreamFilterNavigation from '@/modules/content-stream/components/ContentStreamFilterNavigation.vue';
import { ContentModel, ProfileType } from '@lyvely/common';
import { useCreateMessageStore } from '@/modules/messages/stores/message.store';
import { storeToRefs } from 'pinia';
import { useProfileStore } from '@/modules/profiles/stores/profile.store';
import { onMounted, ref } from 'vue';
import { useContentStreamFilterStore } from '@/modules/content-stream/stores/content-stream-filter.store';
import { focusIfNotTouchScreen } from '@/util';
import { useContentCreateStore } from '@/modules/content/stores/content-create.store';

export interface IProps {
  parent?: ContentModel;
}

const props = defineProps<IProps>();

const { filter } = storeToRefs(useContentStreamFilterStore());
const emits = defineEmits(['contentCreated']);

const messageInput = ref<HTMLElement>();

const createMessageStore = useCreateMessageStore();
const { model } = storeToRefs(createMessageStore);

async function submitMessage() {
  const newMessage = await createMessageStore.submit(filter.value.parentId);
  emits('contentCreated', newMessage);
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

onMounted(() => {
  focusIfNotTouchScreen(messageInput.value);
});

const onInputKeydown = (evt: KeyboardEvent) => {
  if (evt.ctrlKey && evt.key === '+') {
    evt.preventDefault();
    openCreateContentModal();
  }
};
</script>

<template>
  <div class="p-2 md:p-4 bg-main border-t border-divide">
    <div class="mb-2 md:mb-4">
      <content-stream-filter-navigation />
    </div>
    <div class="flex flex-col">
      <div class="flex gap-1 md:gap-3">
        <ly-button
          class="primary rounded-full w-10 h-10 flex items-center"
          @click="openCreateContentModal">
          <ly-icon name="plus"></ly-icon>
        </ly-button>
        <input
          ref="messageInput"
          v-model="model.text"
          type="text"
          class="rounded-full"
          :placeholder="$t(placeholderKey)"
          @keyup.enter="submitMessage"
          @keydown="onInputKeydown" />
        <ly-button class="primary rounded-full w-10 h-10 flex items-center" @click="submitMessage">
          <ly-icon name="send"></ly-icon>
        </ly-button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
