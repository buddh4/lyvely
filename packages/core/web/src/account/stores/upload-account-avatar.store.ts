import { defineStore } from 'pinia';
import { useAccountService } from '@/account/services/account.service';
import { loadingStatus, useStatus } from '@/core';
import { useAuthStore } from '@/auth/store/auth.store';
import { nextTick, ref, watch } from 'vue';
import Cropper from 'cropperjs';
import { AvatarModel } from '@lyvely/core-interface';

export const useAccountAvatarStore = defineStore('upload-account-avatar', () => {
  const status = useStatus();
  const showCropImageModal = ref(false);
  const showUpdateAvatarModal = ref(false);
  let cropper: Cropper | undefined;

  async function updateAvatar() {
    if (!cropper) return;
    cropper.getCroppedCanvas({ width: 64, height: 64 }).toBlob(uploadAvatar, 'image/jpeg', 1);
  }

  async function updateGravatar() {
    await setAvatar(loadingStatus(useAccountService().updateGravatar(), status));
  }

  async function uploadAvatar(blob: Blob | null) {
    if (!blob) return;
    await setAvatar(loadingStatus(useAccountService().updateAvatar(blob), status));
  }

  async function setAvatar(promise: Promise<AvatarModel>) {
    useAuthStore().user!.avatar = await promise;
    reset();
  }

  watch(showCropImageModal, (show) => {
    if (!show) reset();
  });

  function cropImageFile(file: Blob) {
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      showCropImageModal.value = true;
      nextTick(() => {
        const imagePreview = document.getElementById('imagePreview') as HTMLImageElement;
        imagePreview!.src = <any>reader.result;
        cropper = new Cropper(imagePreview!, {
          aspectRatio: 1,
          viewMode: 3,
          zoomable: false,
        });
      });
    });

    reader.readAsDataURL(file);
  }

  function reset() {
    status.resetStatus();
    cropper = undefined;
    showCropImageModal.value = false;
    showUpdateAvatarModal.value = false;
    const input = document.getElementById('new-avatar') as HTMLInputElement;
    input.value = '';
  }

  return {
    updateAvatar,
    updateGravatar,
    cropImageFile,
    showUpdateAvatarModal,
    showCropImageModal,
    ...status,
  };
});
