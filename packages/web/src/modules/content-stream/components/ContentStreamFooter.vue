<script lang="ts" setup>
import ContentStreamFilterNavigation from '@/modules/content-stream/components/ContentStreamFilterNavigation.vue';
import { ProfileType } from '@lyvely/common';
import { useCreateMessageStore } from '@/modules/messages/stores/message.store';
import { storeToRefs } from 'pinia';
import { useProfileStore } from '@/modules/profiles/stores/profile.store';
import { onMounted, onUnmounted, ref } from 'vue';
import { useContentStreamFilterStore } from '@/modules/content-stream/stores/content-stream-filter.store';
import { focusIfNotTouchScreen } from '@/util';

const { filter } = storeToRefs(useContentStreamFilterStore());
const emits = defineEmits(['contentCreated']);

const messageInput = ref<HTMLElement>();

const createMessageStore = useCreateMessageStore();
const { model } = storeToRefs(createMessageStore);

async function submitMessage() {
  const newMessage = await createMessageStore.submit(filter.value.parent);
  emits('contentCreated', newMessage);
}

const profileStore = useProfileStore();
const placeholderKey =
  profileStore.profile!.type === ProfileType.User
    ? 'stream.editor.placeholder_single_user'
    : 'stream.editor.placeholder_multi_user';

const footerRoot = ref<HTMLElement>();
onMounted(() => {
  focusIfNotTouchScreen(messageInput.value);
  console.log(footerRoot.value!.offsetHeight);
  document.documentElement.style.setProperty(
    '--mobile-body-bottom-margin',
    `${footerRoot.value!.offsetHeight}px`,
  );
});
onUnmounted(() => {
  document.documentElement.style.removeProperty('--mobile-body-bottom-margin');
});
</script>

<template>
  <div
    id="content-stream-footer"
    ref="footerRoot"
    class="p-2 md:p-4 bg-main border-t border-divide">
    <div class="mb-2 md:mb-4 bg">
      <content-stream-filter-navigation />
    </div>
    <div class="flex flex-col">
      <div class="flex gap-1 md:gap-3">
        <ly-button class="primary rounded-full w-10 h-10 flex items-center">
          <ly-icon name="plus"></ly-icon>
        </ly-button>
        <input
          ref="messageInput"
          v-model="model.text"
          type="text"
          class="rounded-full"
          :placeholder="$t(placeholderKey)"
          @keyup.enter="submitMessage" />
        <ly-button class="primary rounded-full w-10 h-10 flex items-center" @click="submitMessage">
          <ly-icon name="send"></ly-icon>
        </ly-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media (max-width: 767px) {
  #content-stream-footer {
    min-width: 100vw;
    position: fixed;
    bottom: 0;
    left: 0;
  }
}
</style>
