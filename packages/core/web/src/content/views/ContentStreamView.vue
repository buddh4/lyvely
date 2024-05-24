<script lang="ts" setup>
import ContentStreamFooter from '../components/ContentStreamFooter.vue';
import ContentStream from '../components/ContentStream.vue';
import {
  ContentRequestFilter,
  CreateMessagePermission,
  MessageModel,
  ProfileType,
} from '@lyvely/interface';
import { useRouter } from 'vue-router';
import { useContentCreateStore, useContentStreamFilter } from '../stores';
import { storeToRefs } from 'pinia';
import emptyImageUrl from '@/assets/empty.png';
import { useProfileStore, useProfilePermissions } from '@/profiles';

const { filter } = useContentStreamFilter();
filter.value = new ContentRequestFilter();
filter.value.fromQuery(useRouter().currentRoute.value.query);

const addButtonText =
  useProfileStore().profile!.type === ProfileType.User
    ? 'stream.editor.placeholder_single_user'
    : 'stream.editor.placeholder_multi_user';

const { isAllowed: canCreateMessage } = usePermissions(CreateMessagePermission);

async function openCreateContentModal() {
  return useContentCreateStore().createContentType(MessageModel.contentType);
}
</script>

<template>
  <content-stream :batch-size="40">
    <template #stream-empty>
      <div class="flex h-full w-full items-center justify-center">
        <div
          data-id="empty-stream"
          class="bg-main main border-divide flex cursor-pointer flex-col items-center justify-center gap-3 rounded p-5 md:border md:shadow-lg"
          @click="openCreateContentModal">
          <img :src="emptyImageUrl" :alt="addButtonText" class="h-72 md:rounded" />
          <h1 class="text-sm font-bold">No content has been added yet</h1>
          <ly-button v-if="canCreateMessage" class="primary text-sm" :text="addButtonText" />
        </div>
      </div>
    </template>
  </content-stream>
  <content-stream-footer />
</template>

<style scoped></style>
