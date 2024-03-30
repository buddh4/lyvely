<script lang="ts" setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useProfileStore, useUpdateProfileMembershipSettingsStore } from '@/profiles/stores';
import { I18nModelValidator, t } from '@/i18n';
import { UserAvatar } from '@lyvely/web';

const profileStore = useProfileStore();
const updateProfileMembershipSettingsStore = useUpdateProfileMembershipSettingsStore();

const { model } = storeToRefs(updateProfileMembershipSettingsStore);

const membership = computed(() => profileStore.profile!.getMembership());

const validator = computed(
  () => updateProfileMembershipSettingsStore.validator as I18nModelValidator,
);

async function updateSettings() {
  await updateProfileMembershipSettingsStore.update();
}
</script>

<template>
  <ly-list-page title="profiles.settings.membership.headline" aria-label="tags.view.aria.title">
    <ly-list-page-section>
      <div class="flex items-center">
        <ly-icon name="info" class="info mr-1" />
        <i18n-t
          keypath="profiles.settings.membership.your_role"
          tag="span"
          class="text-center text-dimmed text-sm">
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
        :status="updateProfileMembershipSettingsStore.status"
        label-key="profiles.settings.membership">
        <div class="flex mb-2 flex-row items-stretch">
          <div class="w-full relative">
            <ly-text-field property="displayName" class="mb-0" />
          </div>
          <div
            class="ml-3 bg-highlight w-20 flex justify-center items-center rounded border border-divide cursor-pointer">
            <user-avatar class="m-3" />
          </div>
        </div>

        <ly-textarea property="description" />
      </ly-form-model>

      <div class="flex mt-2 md:mt-4">
        <ly-button
          data-id="btn-submit-settings"
          class="primary text-xs ml-auto"
          @click="updateSettings">
          {{ t('common.update') }}
        </ly-button>
      </div>
    </ly-list-page-section>

    <ly-list-page-section class="bg-red-200 dark:bg-red-950">
      <div class="flex">
        <ly-button
          class="danger text-xs ml-auto"
          :confirm="{ text: 'profiles.settings.archive.confirm' }">
          {{ t('profiles.settings.membership.archive') }}
        </ly-button>
      </div>
    </ly-list-page-section>
  </ly-list-page>
</template>

<style scoped></style>
