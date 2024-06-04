<script lang="ts" setup>
import { useAuthStore } from '@/auth/stores/auth.store';
import { useProfileRelationInfosStore } from '@/profiles/stores/profile-relation-infos.store';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { AvatarModel, ProfileType, useUserAccountClient } from '@lyvely/interface';
import { UserAvatar } from '@/users';
import { UpdateAvatarModal } from '@/avatars';

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const profileRelationInfosStore = useProfileRelationInfosStore();
const profileRelations = await profileRelationInfosStore.getRelations();
const orgCount = profileRelations.profiles.filter(
  (p) => p.type === ProfileType.Organization
).length;
const groupCount = profileRelations.profiles.filter((p) => p.type === ProfileType.Group).length;
const userProfileCount = profileRelations.profiles.filter(
  (p) => p.type === ProfileType.User
).length;

const showUpdateAvatarModal = ref(false);
const userAccountClient = useUserAccountClient();

function onAvatarUpdate(avatar: AvatarModel) {
  if (!user.value) return;
  user.value.avatar = avatar;
}
</script>

<template>
  <div v-if="user" class="flex items-center justify-center">
    <button
      type="button"
      data-id="btn-change-avatar"
      role="button"
      class="relative m-5 cursor-pointer"
      @click="showUpdateAvatarModal = true">
      <user-avatar data-id="my-account-avatar" class="border-main h-16 w-16 border text-xl" />
      <div
        class="border-main absolute bottom-0 right-0 flex h-6 w-6 justify-center rounded-full border bg-shadow">
        <ly-icon name="camera" class="color-main p-0.5" />
      </div>
    </button>
    <update-avatar-modal
      v-model="showUpdateAvatarModal"
      :client="userAccountClient"
      @success="onAvatarUpdate" />
    <div class="flex flex-col px-2 py-5">
      <h2 class="text-xl font-bold">{{ user.username }}</h2>
      <div class="flex">
        <div class="mr-2 flex items-center">
          <span class="mr-1 font-bold">{{ userProfileCount }}</span>
          <span class="text-sm">Profiles</span>
        </div>
        <div class="mr-2 flex items-center">
          <span class="mr-1 font-bold">{{ groupCount }}</span>
          <span class="text-sm">Groups</span>
        </div>
        <div class="flex items-center">
          <span class="mr-1 font-bold">{{ orgCount }}</span>
          <span class="text-sm">Organizations</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
