<script lang="ts" setup>
import { useProfileRelationInfosStore } from '@/profiles/stores/profile-relation-infos.store';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { useCreateProfileStore } from '@/profiles/stores/create-profile.store';
import {
  CreateGroupProfilePermission,
  CreateOrganizationProfilePermission,
  CreateUserProfilePermission,
  ProfileType,
} from '@lyvely/interface';
import { t } from '@/i18n';
import { useGlobalPermissions } from '@/common/composables';
import ProfileRelationsChooserList from './ProfileRelationsChooserList.vue';

const profileRelationInfosStore = useProfileRelationInfosStore();

const { statusError } = storeToRefs(profileRelationInfosStore);
const allProfileRelations = ref(await profileRelationInfosStore.getRelations());

const organizations = computed(() =>
  allProfileRelations.value.profiles.filter((p) => p.type === ProfileType.Organization),
);

const profiles = computed(() =>
  allProfileRelations.value.profiles.filter((p) => p.type !== ProfileType.Organization),
);

const { show: showCreateProfile, isOrganization } = storeToRefs(useCreateProfileStore());

const createOrganization = () => {
  isOrganization.value = true;
  showCreateProfile.value = true;
};

const { isAllowed: canCreateProfile } = useGlobalPermissions(
  CreateUserProfilePermission,
  CreateGroupProfilePermission,
);

const { isAllowed: canCreateOrganization } = useGlobalPermissions(
  CreateOrganizationProfilePermission,
);

// TODO: A user might have multiple relations with a single profile...
// TODO: (permissions) "Can create organizations" policy
// TODO: (permissions) "Can create profile" policy
</script>
<template>
  <ul v-if="statusError" class="divide-y divide-divide w-64 md:w-96">
    <li class="py-3 px-4">
      <ly-alert type="danger" :text="statusError" />
    </li>
  </ul>
  <ul v-else class="divide-y divide-divide w-80 md:w-96">
    <li v-if="canCreateOrganization || organizations.length" class="py-3 px-4">
      <div class="flex items-center">
        <span class="text-sm font-bold">
          {{ t('profiles.labels.organizations') }}
        </span>
        <ly-add-button
          v-if="canCreateOrganization"
          data-id="btn-create-organization"
          class="m-auto"
          @click="createOrganization" />
      </div>
    </li>
    <profile-relations-chooser-list :relations="organizations" />
    <li class="py-3 px-4">
      <div class="flex items-center">
        <span class="text-sm font-bold">
          {{ t('profiles.labels.profiles') }}
        </span>
        <ly-add-button
          v-if="canCreateProfile"
          data-id="btn-create-profile"
          class="m-auto"
          @click="showCreateProfile = true" />
      </div>
    </li>
    <profile-relations-chooser-list :relations="profiles" />
  </ul>
</template>

<style scoped></style>
