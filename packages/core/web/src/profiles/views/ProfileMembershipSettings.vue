<script lang="ts" setup>
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useProfileStore, useUpdateProfileMembershipSettingsStore } from '@/profiles/stores';
import { I18nModelValidator, t } from '@/i18n';
import { AvatarModel, useProfileMembershipClient } from '@lyvely/interface';
import UserRelationAvatar from '../components/avatars/UserRelationAvatar.vue';
import { UpdateAvatarModal } from '@/avatars';
import { useAuthStore } from '@/auth';

const profileStore = useProfileStore();
const membershipSettingsStore = useUpdateProfileMembershipSettingsStore();

const { model } = storeToRefs(membershipSettingsStore);

const membership = computed(() => profileStore.profile!.getMembership());

const showUpdateAvatarModal = ref(false);

const validator = computed(() => membershipSettingsStore.validator as I18nModelValidator);

const client = useProfileMembershipClient();

const onAvatarUpdate = (avatar: AvatarModel) => {
  const { user } = useAuthStore();
  if (!user || !membership.value) return;

  membership.value.userInfo.guid = avatar.guid;
  profileStore.getUserInfo(user.id).then((userInfo) => {
    if (!userInfo) return;
    userInfo!.guid = avatar.guid;
  });
};
</script>

<template>
  <ly-list-page title="profiles.settings.membership.headline" aria-label="tags.view.aria.title">
    <ly-list-page-section>
      <div class="flex items-center">
        <ly-icon name="info" class="info mr-1" />
        <i18n-t
          keypath="profiles.settings.membership.your_role"
          tag="span"
          class="text-center text-sm text-dimmed">
          <template #role>
            <b v-if="membership">{{ t(`profiles.roles.${membership.role}`) }}</b>
          </template>
        </i18n-t>
      </div>
    </ly-list-page-section>

    <ly-list-page-section>
      <ly-form-model
        id="profile-membership-settings"
        v-model="model"
        :validator="validator"
        :status="membershipSettingsStore.status"
        label-key="profiles.settings.membership">
        <div class="mb-2 flex flex-row items-stretch">
          <div class="relative w-full">
            <ly-text-field property="displayName" class="mb-0" />
          </div>
          <button
            data-id="btn-change-avatar"
            class="ml-3 flex w-20 cursor-pointer items-center justify-center rounded border border-divide bg-highlight"
            @click="showUpdateAvatarModal = true">
            <user-relation-avatar data-id="user-relation-avatar" class="m-3" />
          </button>
          <update-avatar-modal
            v-model="showUpdateAvatarModal"
            :client="client"
            @success="onAvatarUpdate" />
        </div>

        <ly-textarea property="description" />
      </ly-form-model>

      <div class="mt-2 flex md:mt-4">
        <ly-button
          data-id="btn-submit-settings"
          class="primary ml-auto text-xs"
          @click="membershipSettingsStore.update">
          {{ t('common.update') }}
        </ly-button>
      </div>
    </ly-list-page-section>

    <ly-list-page-section class="bg-red-200 dark:bg-red-950">
      <div class="flex">
        <ly-button
          data-id="btn-revoke"
          class="danger ml-auto text-xs"
          :confirm="{ text: 'profiles.settings.membership.revoke.confirm' }"
          text="profiles.settings.membership.revoke.title"
          @click="membershipSettingsStore.revoke" />
      </div>
    </ly-list-page-section>
  </ly-list-page>
</template>

<style scoped></style>
