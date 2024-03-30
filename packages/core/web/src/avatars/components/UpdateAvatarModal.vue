<script setup lang="ts">
import { LyModal } from '@lyvely/ui';
import { loadingStatus, useStatus } from '@/core';
import { computed, nextTick, ref, watch } from 'vue';
import { AvatarModel, type IUpdateAvatarClient, useUserAccountClient } from '@lyvely/interface';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.min.css';

const props = defineProps<{
  modelValue: boolean;
  client: IUpdateAvatarClient;
}>();

const emit = defineEmits(['success', 'update:modelValue']);

const status = useStatus();
const showCropImageModal = ref(false);
const showUpdateAvatarModal = ref(false);
const fileInput = ref<HTMLInputElement>();
let cropper: Cropper | undefined;

async function updateAvatar() {
  if (!cropper) return;
  cropper.getCroppedCanvas({ width: 64, height: 64 }).toBlob(uploadAvatar, 'image/jpeg', 1);
}

async function updateGravatar() {
  await setAvatar(loadingStatus(props.client.updateGravatar(), status));
}

async function uploadAvatar(blob: Blob | null) {
  if (!blob) return;

  const file = new File([blob], 'avatar.jpeg', { type: 'image/jpeg' });
  const formData = new FormData();
  formData.append('file', file, 'avatar.jpeg');
  await setAvatar(loadingStatus(props.client.updateAvatar(formData), status));
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
