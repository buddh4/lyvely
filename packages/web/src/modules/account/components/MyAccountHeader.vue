<script lang="ts" setup>
import { useAuthStore } from '@/modules/auth/store/auth.store';
import { useProfileRelationInfosStore } from '@/modules/profiles/stores/profile-relation-infos.store';
import { storeToRefs } from 'pinia';
import { ref, nextTick } from 'vue';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.min.css';
import { ProfileType } from '@lyvely/common';
import LyIcon from "@/modules/ui/components/icon/UIIcon.vue";
import LyModal from "@/modules/ui/components/modal/ModalWindow.vue";
import { useUploadAccountAvatarStore } from "@/modules/account/stores/upload-account-avatar.store";

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const profileRelationInfosStore = useProfileRelationInfosStore();
const profileRelations = await profileRelationInfosStore.getRelations();
const orgCount = profileRelations.profiles.filter((p) => p.type === ProfileType.Organization).length;
const groupCount = profileRelations.profiles.filter((p) => p.type === ProfileType.Group).length;
const userProfileCount = profileRelations.profiles.filter((p) => p.type === ProfileType.User).length;

const newAvatarFileInput = ref<HTMLInputElement>();
const showCropImageModal = ref(false);
let cropper: Cropper|undefined;

function selectNewAvatar() {
  newAvatarFileInput.value?.click();
}

function processNewAvatar(evt: any) {
  if(!newAvatarFileInput.value?.files?.length) return;

  const file = newAvatarFileInput.value.files[0];

  const reader = new FileReader();

  reader.addEventListener("load", () => {
    showCropImageModal.value = true;
    nextTick(() => {
      const imagePreview = document.getElementById('imagePreview') as HTMLImageElement;
      imagePreview!.src = <any> reader.result;
      cropper = new Cropper(imagePreview!, {
        aspectRatio: 1,
        viewMode: 3,
        zoomable: false
      })
    })
  })

  reader.readAsDataURL(file);
}

async function uploadAvatar() {
  if(!cropper) return;

  cropper.getCroppedCanvas({ width: 64, height: 64 }).toBlob((blob) => {
    if(blob) {
      useUploadAccountAvatarStore().updateAvatar(blob);
    }
  }, 'image/jpeg', 1);
}
</script>

<template>
  <div v-if="user" class="flex items-center justify-center">
    <div class="m-5 relative cursor-pointer" @click="selectNewAvatar">

      <ly-user-avatar class="w-16 h-16 text-xl border border-main" />
      <div class="w-6 h-6 absolute flex justify-center bg-shadow bottom-0 right-0 border border-main rounded-full">
        <ly-icon name="camera" class="p-0.5 color-main"/>
      </div>
      <input id="new-avatar" ref="newAvatarFileInput" type="file" class="hidden" @change="processNewAvatar" />
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

  <ly-modal v-model="showCropImageModal" width="2xl"  title="cropper.title" @submit="uploadAvatar">
    <div>
      <img id="imagePreview" src="" alt="Image preview" style="display: block;max-width: 100%" />
    </div>
  </ly-modal>
</template>

<style scoped></style>
