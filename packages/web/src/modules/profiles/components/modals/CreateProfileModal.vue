<script lang="ts" setup>
import { useCreateProfileStore } from '@/modules/profiles/stores/create-profile.store';
import { storeToRefs } from 'pinia';
import { ProfileUsage, ProfileType } from '@lyvely/common';
import { translate } from '@/i18n';
import LyBadgeChooser from '@/modules/ui/components/form/BadgeChooser.vue';

const createProfileStore = useCreateProfileStore();
const { show, model, validator, error } = storeToRefs(createProfileStore);
const { reset, submit } = createProfileStore;

const userType = ProfileType.User;
const groupType = ProfileType.Group;
const usageOptions = [
  ProfileUsage.Business,
  ProfileUsage.Private,
  ProfileUsage.Health,
  ProfileUsage.School,
  ProfileUsage.Family,
  ProfileUsage.Improvement,
];
const usageLabel = (usage: string) => translate('profile.usage.' + usage.toLowerCase());
</script>

<template>
  <ly-modal v-model="show" title="profile.create.title" @cancel="reset" @submit="submit">
    <ly-form-model v-model="model" label-key="profile.create.properties" :validator="validator">
      <ly-input-text property="name" :required="true" />
      <ly-input-textarea property="description" />
      <ly-badge-chooser
        v-model="model.usage"
        label="profile.create.placeholders.usage"
        :options="usageOptions"
        :labels="usageLabel" />
      <ly-input-radio property="type" label="profile.create.properties.user" :value="userType" />
      <ly-input-radio property="type" label="profile.create.properties.group" :value="groupType" />
    </ly-form-model>
    <ly-alert :message="error" class="mt-2" />
  </ly-modal>
</template>

<style scoped></style>
