<script lang="ts" setup>
import { useProfileRelationInfosStore } from '@/profiles/stores/profile-relation-infos.store';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { useCreateProfileStore } from '@/profiles/stores/create-profile.store';
import {
  CreateGroupProfilePermission,
  CreateOrganizationProfilePermission,
  CreateUserProfilePermission,
  ProfileRelationInfo,
  ProfileType,
} from '@lyvely/interface';
import { t } from '@/i18n';
import { useGlobalPermissions } from '@/common/composables';
import ProfileRelationsChooserList from './ProfileRelationsChooserList.vue';

const profileRelationInfosStore = useProfileRelationInfosStore();

const { statusError } = storeToRefs(profileRelationInfosStore);
const allProfileRelations = ref(await profileRelationInfosStore.getRelations());

const filterArchived = ref(false);
const searchInput = ref<HTMLInputElement>();
const search = ref('');

function filterRelation(relation: ProfileRelationInfo) {
  if (filterArchived.value !== !!relation.archived) return false;
  if (search.value?.length) {
    const searchValue = search.value;
    return relation.name.includes(searchValue) || relation.description?.includes(searchValue);
  }
  return true;
}

const organizations = computed(() =>
  allProfileRelations.value.profiles.filter(
    (r) => r.type === ProfileType.Organization && filterRelation(r)
  )
);

const profiles = computed(() =>
  allProfileRelations.value.profiles.filter(
    (r) => r.type !== ProfileType.Organization && filterRelation(r)
  )
);

const { show: showCreateProfile, isOrganization } = storeToRefs(useCreateProfileStore());

const createOrganization = () => {
  isOrganization.value = true;
  showCreateProfile.value = true;
};

const { isAllowed: canCreateProfile } = useGlobalPermissions(
  CreateUserProfilePermission,
  CreateGroupProfilePermission
);

const { isAllowed: canCreateOrganization } = useGlobalPermissions(
  CreateOrganizationProfilePermission
);

// TODO: A user might have multiple relations with a single profile...
// TODO: (permissions) "Can create organizations" policy
// TODO: (permissions) "Can create profile" policy
</script>
<template>
  <ul v-if="statusError" data-id="profile-relations" class="w-64 divide-y divide-divide md:w-96">
    <li class="px-4 py-3">
      <ly-alert type="danger" :text="statusError" />
    </li>
  </ul>
  <ul v-else data-id="profile-relations" class="w-80 divide-y divide-divide md:w-96">
    <li class="prev-close px-4 pb-1">
      <div class="flex">
        <div>
          <ly-button @click="searchInput?.focus()">
            <ly-icon name="search" />
          </ly-button>
          <input
            ref="searchInput"
            v-model="search"
            type="text"
            class="plain focus-hidden border-none p-0 outline-0 ring-0 focus:ring-0 focus:ring-offset-0" />
        </div>
        <ly-button
          class="ml-auto"
          :title="t('profiles.titles.show-archived')"
          :class="{ 'outline outline-gray-100': filterArchived }"
          @click="filterArchived = !filterArchived">
          <ly-icon name="archive" class="w-3.5" />
        </ly-button>
      </div>
    </li>
    <li v-if="canCreateOrganization || organizations.length" class="px-4 py-3">
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
    <li class="px-4 py-3">
      <div class="flex items-center">
        <span class="text-sm font-bold">
          {{ t('profiles.labels.profiles') }}
        </span>
        <ly-add-button
          v-if="canCreateProfile"
          :title="t('profiles.titles.add-orga')"
          data-id="btn-create-profile"
          class="m-auto"
          @click="showCreateProfile = true" />
      </div>
    </li>
    <profile-relations-chooser-list :relations="profiles" />
  </ul>
</template>

<style scoped></style>
