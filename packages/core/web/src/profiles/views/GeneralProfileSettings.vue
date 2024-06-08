<script lang="ts" setup>
import { useProfileStore } from '@/profiles/stores/profile.store';
import { ProfileAvatar } from '../components';
import { t } from '@/i18n';
import { useUpdateProfileStore } from '../stores';
import { storeToRefs } from 'pinia';
import { ISelectOptions, LyListPageSection, LyConfirmButton } from '@lyvely/ui';
import { getProfileVisibilityOptions } from '../helpers';
import { UpdateAvatarModal } from '@/avatars';
import { computed, ref } from 'vue';
import { AvatarModel, useProfilesClient } from '@lyvely/interface';

const profileStore = useProfileStore();
const { profile } = storeToRefs(profileStore);
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

const canArchive = computed(() => profileStore.isOwner());

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
        <div class="mb-2 flex flex-row items-stretch">
          <div class="w-full">
            <ly-text-field property="name" />
          </div>
          <button
            type="button"
            data-id="btn-change-avatar"
            class="ml-3 flex w-20 cursor-pointer items-center justify-center rounded border border-divide bg-highlight"
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

        <div class="mt-2 flex md:mt-4">
          <ly-button
            data-id="btn-submit-settings"
            class="primary ml-auto text-xs"
            :loading="status.isStatusLoading()"
            @click="submit">
            {{ t('common.update') }}
          </ly-button>
        </div>
      </ly-form-model>
    </ly-list-page-section>

    <ly-list-page-section v-if="canArchive" class="bg-red-200 dark:bg-red-950">
      <div class="flex">
        <ly-confirm-button
          v-if="canArchive && !profile!.archived"
          data-id="archive-profile"
          class="danger ml-auto text-xs"
          :options="{ text: 'profiles.settings.general.archive.confirm' }"
          @click="updateStore.archive">
          {{ t('common.archive') }}
        </ly-confirm-button>
        <ly-confirm-button
          v-if="canArchive && profile!.archived"
          data-id="restore-profile"
          class="warning ml-auto text-xs"
          :options="{ text: 'profiles.settings.general.restore.confirm' }"
          @click="updateStore.restore">
          {{ t('common.restore') }}
        </ly-confirm-button>
      </div>
    </ly-list-page-section>
  </ly-list-page>
</template>

<style scoped></style>
