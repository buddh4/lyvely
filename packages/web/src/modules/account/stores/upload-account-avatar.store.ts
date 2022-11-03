import { defineStore } from 'pinia';
import { useAccountService } from '@/modules/account/services/account.service';
import { loadingStatus, useStatus } from '@/store';
import { useAuthStore } from '@/modules/auth/store/auth.store';
import { nextTick, ref, watch } from 'vue';
import Cropper from 'cropperjs';

export const useUploadAccountAvatarStore = defineStore('upload-account-avatar', () => {
  const status = useStatus();
  const showCropImageModal = ref(false);
  let cropper: Cropper | undefined;

  async function updateAvatar() {
    if (!cropper) return;
    cropper.getCroppedCanvas({ width: 64, height: 64 }).toBlob(uploadAvatar, 'image/jpeg', 1);
  }

  async function uploadAvatar(blob: Blob | null) {
    if (!blob) return;
    useAuthStore().user!.avatar = await loadingStatus(useAccountService().updateAvatar(blob), status);
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
    const input = document.getElementById('new-avatar') as HTMLInputElement;
    input.value = '';
  }

  return {
    updateAvatar,
    cropImageFile,
    showCropImageModal,
    ...status,
  };
});
