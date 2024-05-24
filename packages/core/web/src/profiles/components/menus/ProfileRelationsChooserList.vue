<script lang="ts" setup>
import { isMultiUserProfile, ProfileRelationInfo } from '@lyvely/interface';
import { storeToRefs } from 'pinia';
import { useProfileStore } from '../../stores';
import { profileIdRoute } from '../../routes';
import { isNavigationFailure, useRouter } from 'vue-router';
import ProfileAvatar from '../ProfileAvatar.vue';

defineProps<{
  relations: ProfileRelationInfo[];
}>();

const { profile } = storeToRefs(useProfileStore());
const router = useRouter();

async function setProfile(pid: string) {
  const currentRoute = router.currentRoute.value;
  const isProfileView = !!currentRoute.meta.isPublic;

  const viewName = isProfileView
    ? currentRoute.meta.baseName || <string>currentRoute.name
    : undefined;
  const result = await router.push(profileIdRoute(pid, { viewName }));
  if (isNavigationFailure(result)) console.error(result);
}

function getProfileIcon(relation: ProfileRelationInfo) {
  return isMultiUserProfile(relation.type) ? 'group' : 'private';
}
</script>
<template>
  <li v-if="relations.length">
    <ly-divided-list>
      <ly-list-item
        v-for="relation in relations"
        :key="relation.id"
        :active="profile?.id === relation.id"
        @click="setProfile(relation.id)">
        <div class="flex items-center space-x-4">
          <div class="flex-shrink-0">
            <profile-avatar :profile="relation" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium">
              {{ relation.name }}
            </p>
            <ly-dimmed
              class="text-xs"
              :text="{ plain: relation.description || '' }"
              :truncate="true" />
          </div>
          <div>
            <ly-icon :name="getProfileIcon(relation)" />
          </div>
        </div>
      </ly-list-item>
    </ly-divided-list>
  </li>
</template>

<style scoped></style>
