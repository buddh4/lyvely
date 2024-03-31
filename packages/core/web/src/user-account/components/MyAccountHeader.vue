<script lang="ts" setup>
import { useAuthStore } from '@/auth/store/auth.store';
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
  (p) => p.type === ProfileType.Organization,
).length;
const groupCount = profileRelations.profiles.filter((p) => p.type === ProfileType.Group).length;
const userProfileCount = profileRelations.profiles.filter(
  (p) => p.type === ProfileType.User,
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
      data-id="btn-change-avatar"
      role="button"
      class="m-5 relative cursor-pointer"
      @click="showUpdateAvatarModal = true">
      <user-avatar data-id="my-account-avatar" class="w-16 h-16 text-xl border border-main" />
      <div
        class="w-6 h-6 absolute flex justify-center bg-shadow bottom-0 right-0 border border-main rounded-full">
        <ly-icon name="camera" class="p-0.5 color-main" />
      </div>
    </button>
    <update-avatar-modal
      v-model="showUpdateAvatarModal"
      :client="userAccountClient"
      @success="onAvatarUpdate" />
    <div class="py-5 px-2 flex flex-col">
      <h2 class="font-bold text-xl">{{ user.username }}</h2>
      <div class="flex">
        <div class="flex items-center mr-2">
          <span class="mr-1 font-bold">{{ userProfileCount }}</span>
          <span class="text-sm">Profiles</span>
        </div>
        <div class="flex items-center mr-2">
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
