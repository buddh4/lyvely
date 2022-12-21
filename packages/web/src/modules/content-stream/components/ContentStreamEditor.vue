<script lang="ts" setup>
import { useProfileStore } from '@/modules/profiles/stores/profile.store';
import { ProfileType } from '@lyvely/common';

const profileStore = useProfileStore();
const placeholderKey =
  profileStore.profile!.type === ProfileType.User
    ? 'stream.editor.placeholder_single_user'
    : 'stream.editor.placeholder_multi_user';
</script>

<template>
  <div class="flex flex-col">
    <div class="flex gap-1">
      <ly-button class="primary rounded-xl w-10 h-10"><ly-icon name="plus"></ly-icon></ly-button>
      <input type="text" class="rounded-xl" :placeholder="$t(placeholderKey)" />
      <ly-button class="primary rounded-xl w-10 h-10"><ly-icon name="send"></ly-icon></ly-button>
    </div>
  </div>
</template>

<style scoped></style>
