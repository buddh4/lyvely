<script lang="ts" setup>
import { useCreateProfileStore } from '@/profiles/stores/create-profile.store';
import { storeToRefs } from 'pinia';
import {
  ProfileUsage,
  ProfileType,
  CreateGroupProfilePermission,
  CreateUserProfilePermission,
  CreateOrganizationProfilePermission,
} from '@lyvely/interface';
import { translate } from '@/i18n';
import { useRouter } from 'vue-router';
import { profileRoute } from '@/profiles/routes/profile-route.helper';
import { useGlobalPermissions } from '@/common/composables';

const props = defineProps<{
  oid?: string;
}>();

const createProfileStore = useCreateProfileStore();
const { show, model, validator, error, isOrganization } = storeToRefs(createProfileStore);
const { reset, submit } = createProfileStore;

const router = useRouter();

const createProfile = () =>
  submit(props.oid).then((profile) => router.push(profileRoute('stream', profile.handle)));

const usageOptions = [
  ProfileUsage.Business,
  ProfileUsage.Private,
  ProfileUsage.Health,
  ProfileUsage.School,
  ProfileUsage.Family,
  ProfileUsage.Improvement,
];
const usageLabel = (usage: string) => translate('profiles.usage.' + usage.toLowerCase());

const { isAllowed: canCreateOrganization } = useGlobalPermissions(
  CreateOrganizationProfilePermission,
);
const { isAllowed: canCreateGroupProfile } = useGlobalPermissions(CreateGroupProfilePermission);
const { isAllowed: canCreateUserProfile } = useGlobalPermissions(CreateUserProfilePermission);
</script>

<template>
  <ly-modal
    v-model="show"
    title="profiles.create.title"
    @cancel="reset"
    @close="reset"
    @submit="createProfile">
    <ly-form-model
      id="create-profile"
      v-model="model"
      label-key="profiles.create.properties"
      :validator="validator">
      <ly-text-field property="name" :required="true" />
      <ly-textarea property="description" />
      <ly-badge-picker
        v-model="model.usage"
        label="profiles.create.placeholders.usage"
        :options="usageOptions"
        :labels="usageLabel" />
      <ly-radio
        v-if="!isOrganization && canCreateUserProfile"
        property="type"
        label="profiles.create.properties.user"
        :value="ProfileType.User" />
      <ly-radio
        v-if="!isOrganization && canCreateGroupProfile"
        property="type"
        label="profiles.create.properties.group"
        :value="ProfileType.Group" />
      <ly-radio
        v-if="isOrganization && !oid && canCreateOrganization"
        property="type"
        label="profiles.create.properties.organization"
        :value="ProfileType.Organization" />
    </ly-form-model>
    <ly-alert type="danger" :text="error" class="mt-2" />
  </ly-modal>
</template>

<style scoped></style>
