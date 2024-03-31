<script lang="ts" setup>
import { useProfileStore } from '@/profiles/stores/profile.store';
import { ProfileAvatar } from '../components';
import { t } from '@/i18n';
import { useUpdateProfileStore } from '../stores';
import { storeToRefs } from 'pinia';
import { ISelectOptions, LyListPageSection } from '@lyvely/ui';
import { getProfileVisibilityOptions } from '../helpers';
import { UpdateAvatarModal } from '@/avatars';
import { ref } from 'vue';
import { AvatarModel, useProfilesClient } from '@lyvely/interface';

const { profile } = storeToRefs(useProfileStore());
const updateStore = useUpdateProfileStore();
const { setUpdateModel, submit, status } = updateStore;
const { model, validator } = storeToRefs(updateStore);
const showUpdateAvatarModal = ref(false);
const client = useProfilesClient();

setUpdateModel(profile.value!.id, profile.value!.toEditModel());

const onAvatarUpdate = (avatar: AvatarModel) => {
  if (!profile.value) return;
  profile.value.avatar = avatar;
};

const visibilityOptions: ISelectOptions = getProfileVisibilityOptions();
</script>

<template>
  <ly-list-page title="profiles.settings.general.headline" aria-label="tags.view.aria.title">
    <ly-list-page-section>
      <ly-form-model
        id="profile-settings"
        v-model="model"
        label-key="profiles.settings.general"
        :validator="validator!">
        <div class="flex mb-2 flex-row items-stretch">
          <div class="w-full">
            <ly-text-field property="name" />
          </div>
          <button
            data-id="btn-change-avatar"
            class="ml-3 bg-highlight w-20 flex justify-center items-center rounded border border-divide cursor-pointer"
            @click="showUpdateAvatarModal = true">
            <profile-avatar class="m-3" />
          </button>
          <update-avatar-modal
            v-model="showUpdateAvatarModal"
            :client="client"
            @success="onAvatarUpdate" />
        </div>

        <div class="mb-2">
          <ly-select property="visibility" :options="visibilityOptions" />
        </div>

        <ly-textarea property="description" />

        <div class="flex mt-2 md:mt-4">
          <ly-button
            data-id="btn-submit-settings"
            class="primary text-xs ml-auto"
            :loading="status.isStatusLoading()"
            @click="submit">
            {{ t('common.update') }}
          </ly-button>
        </div>
      </ly-form-model>
    </ly-list-page-section>

    <ly-list-page-section class="bg-red-200 dark:bg-red-950">
      <div class="flex">
        <ly-button
          class="danger text-xs ml-auto"
          :confirm="{ text: 'profiles.settings.archive.confirm' }">
          {{ t('common.archive') }}
        </ly-button>
      </div>
    </ly-list-page-section>
  </ly-list-page>
</template>

<style scoped></style>
