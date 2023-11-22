<script lang="ts" setup>
import { useCreateProfileStore } from '@/profiles/stores/create-profile.store';
import { storeToRefs } from 'pinia';
import { ProfileUsage, ProfileType } from '@lyvely/interface';
import { translate } from '@/i18n';
import { useRouter } from 'vue-router';
import { profileRoute } from '@/profiles/routes/profile-route.helper';

const createProfileStore = useCreateProfileStore();
const { show, model, validator, error } = storeToRefs(createProfileStore);
const { reset, submit } = createProfileStore;

const router = useRouter();

const createProfile = () =>
  submit().then((profile) => router.push(profileRoute('stream', profile.handle)));

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
const usageLabel = (usage: string) => translate('profiles.usage.' + usage.toLowerCase());
</script>

<template>
  <ly-modal v-model="show" title="profiles.create.title" @cancel="reset" @submit="createProfile">
    <ly-form-model v-model="model" label-key="profiles.create.properties" :validator="validator">
      <ly-text-field property="name" :required="true" />
      <ly-textarea property="description" />
      <ly-badge-chooser
        v-model="model.usage"
        label="profiles.create.placeholders.usage"
        :options="usageOptions"
        :labels="usageLabel" />
      <ly-radio property="type" label="profiles.create.properties.user" :value="userType" />
      <ly-radio property="type" label="profiles.create.properties.group" :value="groupType" />
    </ly-form-model>
    <ly-alert type="danger" :text="error" class="mt-2" />
  </ly-modal>
</template>

<style scoped></style>
