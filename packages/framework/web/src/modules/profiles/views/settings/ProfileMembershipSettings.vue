<script lang="ts" setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useProfileStore } from '@/modules/profiles/stores/profile.store';
import { useUpdateProfileMembershipSettingsStore } from '@/modules/profiles/stores/profile-membership-settings.store';
import { ModelValidator } from '@lyvely/common';
import { StoreStatusPlugin } from '@/store';

const profileStore = useProfileStore();
const updateProfileMembershipSettingsStore = useUpdateProfileMembershipSettingsStore();

const { model } = storeToRefs(updateProfileMembershipSettingsStore);

const membership = computed(() => profileStore.profile!.getMembership());

const validator = computed(() => updateProfileMembershipSettingsStore.validator as ModelValidator);
const status = computed(() => updateProfileMembershipSettingsStore.status as StoreStatusPlugin);

function updateSettings() {
  updateProfileMembershipSettingsStore.update();
}
</script>

<template>
  <div v-if="membership">
    <ly-content-panel>
      <div class="flex items-center">
        <ly-icon name="info" class="info mr-1" />
        <i18n-t
          keypath="profiles.settings.membership.your_role"
          tag="span"
          class="text-center text-dimmed text-sm">
          <template #role>
            <b>{{ $t(`profiles.roles.${membership.role}`) }}</b>
          </template>
        </i18n-t>
      </div>
    </ly-content-panel>

    <ly-content-panel>
      <ly-form-model
        v-model="model"
        :validator="validator"
        :status="updateProfileMembershipSettingsStore.status"
        label-key="profiles.settings.membership">
        <div class="flex items-center mb-2 flex-row items-stretch">
          <div class="w-full relative">
            <ly-input-text property="displayName" class="mb-0" />
          </div>
          <div
            class="ml-3 bg-highlight w-20 flex justify-center items-center rounded border border-divide cursor-pointer">
            <ly-user-avatar class="m-3" />
          </div>
        </div>

        <div class="w-full relative">
          <ly-input-textarea property="description" />
        </div>
      </ly-form-model>

      <div class="clear-both mt-4">
        <ly-button class="primary float-right" @click="updateSettings">
          {{ $t('common.update') }}
        </ly-button>
      </div>
    </ly-content-panel>

    <ly-content-panel>
      <div>
        <ly-button
          class="danger float-right"
          :confirm="{ text: 'profiles.settings.archive.confirm' }">
          {{ $t('profiles.settings.membership.archive') }}
        </ly-button>
      </div>
    </ly-content-panel>
  </div>
</template>

<style scoped></style>
