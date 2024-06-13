import { defineStore, storeToRefs } from 'pinia';
import {
  ProfileRelationInfo,
  ProfileRelationInfos,
  useProfileRelationInfosClient,
} from '@lyvely/interface';
import { ref, watch } from 'vue';
import { loadingStatus, useStatus } from '@/core';
import { useAuthStore } from '@/auth';

export const useProfileRelationInfosStore = defineStore('profile-relation-infos', () => {
  const profilesRelationInfosClient = useProfileRelationInfosClient();
  const relations = ref<ProfileRelationInfos>({ profiles: [] });
  const status = useStatus();

  const reset = () => {
    relations.value = { profiles: [] };
    status.resetStatus();
  };

  async function getRelations(force = false): Promise<ProfileRelationInfos> {
    return !force && status.isStatusSuccess() ? Promise.resolve(relations.value) : loadRelations();
  }

  const { user } = storeToRefs(useAuthStore());

  watch(user, async (oldUser, newUser) => {
    if (oldUser?.id !== newUser?.id) reset();
  });

  async function loadRelations() {
    return loadingStatus(
      profilesRelationInfosClient.getAllProfileRelationInfos(),
      status,
      undefined,
      (result) => {
        relations.value = result;
      }
    );
  }

  function removeRelation(pid: string) {
    relations.value.profiles = relations.value.profiles.filter((p) => p.id !== pid);
  }

  function updateRelation(pid: string, update: (relation: ProfileRelationInfo) => void) {
    const relation = relations.value.profiles.find((p: ProfileRelationInfo) => p.id === pid);
    if (!relation) return;
    update(relation);
  }

  function addRelation(relation: ProfileRelationInfo) {
    relations.value?.profiles.push(relation);
  }

  return {
    ...status,
    getRelations,
    addRelation,
    updateRelation,
    loadRelations,
    removeRelation,
  };
});
