<script lang="ts" setup>
import ContentStreamFooter from '../components/ContentStreamFooter.vue';
import ContentStream from '../components/ContentStream.vue';
import {
  ContentRequestFilter,
  useMessagePermissions,
  MessageModel,
  ProfileType,
} from '@lyvely/interface';
import { useRouter } from 'vue-router';
import { useContentCreateStore, useContentStreamFilter } from '../stores';
import emptyImageUrl from '@/assets/empty.png';
import { t } from '@/i18n';
import { useProfileStore, useProfilePermissions } from '@/profiles';
import { noop } from '@lyvely/common';

const { filter } = useContentStreamFilter();
filter.value = new ContentRequestFilter();
filter.value.fromQuery(useRouter().currentRoute.value.query);

const addButtonText =
  useProfileStore().profile!.type === ProfileType.User
    ? 'stream.editor.placeholder_single_user'
    : 'stream.editor.placeholder_multi_user';

const { isAllowed: canCreateMessage } = useProfilePermissions(useMessagePermissions().Create);

async function openCreateContentModal() {
  return useContentCreateStore().createContentType(MessageModel.contentType);
}
</script>

<template>
  <content-stream :batch-size="30">
    <template #stream-empty="{ filter: streamFilter }">
      <div class="flex h-full w-full items-center justify-center">
        <div
          data-id="empty-stream"
          :class="[
            { 'cursor-pointer': canCreateMessage && streamFilter.isEmpty() },
            'main flex flex-col items-center justify-center gap-3 rounded border-divide bg-main p-5 md:border md:shadow-lg',
          ]"
          @click="streamFilter.isEmpty() ? openCreateContentModal : noop">
          <img :src="emptyImageUrl" :alt="addButtonText" class="h-72 md:rounded" />
          <h1 class="text-sm font-bold">
            {{ t(streamFilter.isEmpty() ? 'content.stream.empty' : 'content.stream.empty-filter') }}
          </h1>
          <ly-button
            v-if="canCreateMessage && streamFilter.isEmpty()"
            class="primary text-sm"
            :text="addButtonText" />
          <ly-button
            v-if="!streamFilter.isEmpty()"
            class="primary float-right text-xs"
            text="common.filter.clear"
            @click="streamFilter.reset()" />
        </div>
      </div>
    </template>
  </content-stream>
  <content-stream-footer />
</template>

<style scoped></style>
