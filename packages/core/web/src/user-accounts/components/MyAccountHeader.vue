<script lang="ts" setup>
import { useAuthStore } from '@/auth/store/auth.store';
import { useProfileRelationInfosStore } from '@/profiles/stores/profile-relation-infos.store';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import 'cropperjs/dist/cropper.min.css';
import { ProfileType } from '@lyvely/core-interface';
import { useAccountAvatarStore } from '@/user-accounts/stores/upload-account-avatar.store';

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

const accountAvatarStore = useAccountAvatarStore();

const { showCropImageModal, showUpdateAvatarModal } = storeToRefs(accountAvatarStore);

const newAvatarFileInput = ref<HTMLInputElement>();

function selectNewAvatar() {
  showUpdateAvatarModal.value = false;
  setTimeout(() => {
    newAvatarFileInput.value?.click();
  }, 50);
}

function processNewAvatar() {
  if (!newAvatarFileInput.value?.files?.length) return;
  accountAvatarStore.cropImageFile(newAvatarFileInput.value.files[0]);
}

async function uploadAvatar() {
  accountAvatarStore.updateAvatar();
}

function updateGravatar() {
  accountAvatarStore.updateGravatar();
}
</script>

<template>
  <div v-if="user" class="flex items-center justify-center">
    <div class="m-5 relative cursor-pointer" @click="showUpdateAvatarModal = true">
      <ly-user-avatar class="w-16 h-16 text-xl border border-main" />
      <div
        class="w-6 h-6 absolute flex justify-center bg-shadow bottom-0 right-0 border border-main rounded-full">
        <ly-icon name="camera" class="p-0.5 color-main" />
      </div>
      <input
        id="new-avatar"
        ref="newAvatarFileInput"
        type="file"
        class="hidden"
        @change="processNewAvatar" />
    </div>
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

  <ly-modal v-model="showUpdateAvatarModal" title="avatar.title" :show-footer="false">
    <div class="flex flex-col items-stretch space-y-1">
      <ly-button class="primary" text="avatar.upload" @click="selectNewAvatar" />
      <ly-button class="primary" text="avatar.gravatar" @click="updateGravatar" />
    </div>
  </ly-modal>

  <ly-modal v-model="showCropImageModal" width="2xl" title="cropper.title" @submit="uploadAvatar">
    <div>
      <img id="imagePreview" src="" alt="Image preview" style="display: block; max-width: 100%" />
      <ly-alert type="danger" :text="accountAvatarStore?.statusError" class="mt-1" />
    </div>
  </ly-modal>
</template>

<style scoped></style>
