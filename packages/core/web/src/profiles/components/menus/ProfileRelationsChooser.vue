<script lang="ts" setup>
import { useProfileRelationInfosStore } from '@/profiles/stores/profile-relation-infos.store';
import { useProfileStore } from '@/profiles/stores/profile.store';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useRouter, isNavigationFailure } from 'vue-router';
import { useCreateProfileStore } from '@/profiles/stores/create-profile.store';
import { ProfileRelationInfo } from '@lyvely/core-interface';
import LyProfileAvatar from '../ProfileAvatar.vue';

const profileRelationInfosStore = useProfileRelationInfosStore();
const profileStore = useProfileStore();

const { statusError } = storeToRefs(profileRelationInfosStore);
const profileRelations = ref(await profileRelationInfosStore.getRelations());

const { profile } = storeToRefs(profileStore);
const { show: showCreateProfile } = storeToRefs(useCreateProfileStore());

const router = useRouter();

async function setProfile(pid: string) {
  const currentRoute = router.currentRoute.value;
  const paramKeys = Object.keys(currentRoute.params);
  // TODO: check if feature is enabled on target profile
  const useDefaultName =
    currentRoute.meta.nonProfileView || paramKeys.length > 1 || !paramKeys.includes('pid');
  const name = useDefaultName
    ? 'stream'
    : currentRoute.meta.baseName || currentRoute.name || 'stream';
  const result = await router.push({ name, params: { pid } });
  if (isNavigationFailure(result)) console.error(result);
}

function getProfileIcon(relation: ProfileRelationInfo) {
  return relation.isMultiUserProfile() ? 'group' : 'private';
}

// TODO: A user might have multiple relations with a single profile...
// TODO: (permissions) "Can create organizations" policy
// TODO: (permissions) "Can create profile" policy
</script>
<template>
  <ul v-if="statusError" class="divide-y divide-divide w-64 md:w-96">
    <li class="py-3 px-4">
      <ly-alert type="danger" :message="statusError" />
    </li>
  </ul>
  <ul v-else class="divide-y divide-divide w-80 md:w-96">
    <li class="py-3 px-4">
      <div class="flex items-center">
        <span class="text-sm font-bold">
          {{ $t('profiles.labels.profiles') }}
        </span>
        <ly-add-button class="m-auto" @click="showCreateProfile = true" />
      </div>
    </li>
    <li>
      <ly-divided-list v-if="profile">
        <ly-list-item
          v-for="relation in profileRelations.profiles"
          :key="relation.id"
          :active="profile.id === relation.id"
          @click="setProfile(relation.id)">
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <ly-profile-avatar :profile="relation" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate">
                {{ relation.name }}
              </p>
              <ly-dimmed :text="{ plain: relation.description }" :truncate="true" />
            </div>
            <div>
              <ly-icon :name="getProfileIcon(relation)" />
            </div>
          </div>
        </ly-list-item>
      </ly-divided-list>
    </li>
    <!-- li class="py-3 px-4">
      <div class="flex items-center">
        <span class="text-sm font-bold">
          {{ $t('profiles.labels.organizations') }}
        </span>
        <ly-add-button class="m-auto" />
      </div>
    </li>
    <li class="py-3 px-4 text-dimmed text-sm">
      <ly-text-dimmed :text="$t('profile.content-stream.no-organization-relation')" />
    </li -->
  </ul>
</template>

<style scoped></style>
