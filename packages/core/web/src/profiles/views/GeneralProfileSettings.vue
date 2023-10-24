<script lang="ts" setup>
import { useProfileStore } from '@/profiles/stores/profile.store';
import { ProfileAvatar } from '../components';
import { useUpdateProfileStore } from '../stores';
import { storeToRefs } from 'pinia';
import { ISelectOptions } from '@lyvely/ui';
import { getProfileVisibilityOptions } from '../helpers';
import LyFlashMessage from '@/ui/components/LyFlashMessage.vue';
import { ref } from 'vue';

const { profile } = useProfileStore();
const updateStore = useUpdateProfileStore();
const { setUpdateModel, submit, status } = updateStore;
const { model, validator } = storeToRefs(updateStore);

setUpdateModel(profile!.id, profile!.toEditModel());

const visibilityOptions: ISelectOptions = getProfileVisibilityOptions();
const showFlash = ref(false);

setTimeout(() => {
  showFlash.value = true;
});
</script>

<template>
  <ly-form-model v-model="model" label-key="profiles.settings.general" :validator="validator!">
    <ly-content-panel>
      <div class="flex mb-2 flex-row items-stretch">
        <div class="w-full">
          <ly-text-field property="name" />
        </div>
        <div
          class="ml-3 bg-highlight w-20 flex justify-center items-center rounded border border-divide cursor-pointer">
          <profile-avatar class="m-3" />
        </div>
      </div>

      <div class="w-full mb-2 relative">
        <ly-textarea property="description" />
      </div>

      <div>
        <ly-select property="visibility" :options="visibilityOptions" />
      </div>

      <div class="clear-both mt-4">
        <ly-button
          class="primary float-right text-xs"
          :loading="status.isStatusLoading()"
          @click="submit">
          {{ $t('common.update') }}
        </ly-button>
      </div>
    </ly-content-panel>

    <ly-content-panel>
      <div>
        <ly-button
          class="danger float-right text-xs"
          :confirm="{ text: 'profiles.settings.archive.confirm' }">
          {{ $t('common.archive') }}
        </ly-button>
      </div>
    </ly-content-panel>
  </ly-form-model>
</template>

<style scoped></style>
