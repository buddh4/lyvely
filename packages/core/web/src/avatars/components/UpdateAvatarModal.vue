<script setup lang="ts">
import { LyModal } from '@lyvely/ui';
import { loadingStatus, useStatus } from '@/core';
import { computed, nextTick, ref, watch } from 'vue';
import {
  AvatarModel,
  AVATAR_SIZE_LG,
  type IUpdateAvatarClient,
  type IUpdateGravatarClient,
} from '@lyvely/interface';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.min.css';
import { useFlashStore } from '@/ui';

const props = defineProps<{
  modelValue: boolean;
  client: IUpdateAvatarClient & Partial<IUpdateGravatarClient>;
}>();

const emit = defineEmits(['success', 'update:modelValue']);

const { client } = props;
const status = useStatus();
const showCropImageModal = ref(false);
const showUpdateAvatarModal = ref(false);
const fileInput = ref<HTMLInputElement>();
let cropper: Cropper | undefined;

function isGravatarSupported(): boolean {
  return !!client.updateGravatar;
}

async function updateAvatar() {
  if (!cropper) return;
  cropper
    .getCroppedCanvas({ width: AVATAR_SIZE_LG, height: AVATAR_SIZE_LG })
    .toBlob(uploadAvatar, 'image/jpeg', 1);
}

async function updateGravatar() {
  if (!client.updateGravatar) return;

  try {
    await setAvatar(loadingStatus(client.updateGravatar(), status));
  } catch (e) {
    useFlashStore().addUnknownErrorFlash();
  }
}

async function uploadAvatar(blob: Blob | null) {
  if (!blob) return;

  const file = new File([blob], 'avatar.jpeg', { type: 'image/jpeg' });
  const formData = new FormData();
  formData.append('file', file, 'avatar.jpeg');
  try {
    await setAvatar(loadingStatus(props.client.updateAvatar(formData), status));
  } catch (e) {
    useFlashStore().addUnknownErrorFlash();
  }

  show.value = false;
}

async function setAvatar(promise: Promise<AvatarModel>) {
  const avatar = await promise;
  emit('success', avatar);
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
  if (fileInput.value) {
    fileInput.value.value = '';
  }
}

function selectNewAvatar() {
  showUpdateAvatarModal.value = false;
  setTimeout(() => {
    fileInput.value?.click();
  }, 50);
}

function processNewAvatar() {
  if (!fileInput.value?.files?.length) return;
  cropImageFile(fileInput.value.files[0]);
}

const show = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
});
</script>

<template>
  <div>
    <input
      ref="fileInput"
      data-id="avatar-input"
      type="file"
      class="hidden"
      @change="processNewAvatar" />
    <ly-modal v-model="show" title="avatar.title" :show-footer="false">
      <div class="flex flex-col items-stretch space-y-1">
        <ly-button
          data-id="btn-upload-avatar"
          class="primary"
          text="avatar.upload"
          @click="selectNewAvatar" />
        <ly-button
          v-if="isGravatarSupported()"
          data-id="btn-use-gravatar"
          class="primary"
          text="avatar.gravatar"
          @click="updateGravatar" />
      </div>
    </ly-modal>
    <ly-modal v-model="showCropImageModal" width="2xl" title="cropper.title" @submit="updateAvatar">
      <div>
        <img id="imagePreview" src="" alt="Image preview" style="display: block; max-width: 100%" />
      </div>
    </ly-modal>
  </div>
</template>

<style scoped></style>
