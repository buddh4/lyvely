import { defineStore } from 'pinia';
import {
  BaseUserProfileRelationType,
  ProfileRelationInfo,
  ProfileRelationInfos,
  useProfileRelationInfosClient,
} from '@lyvely/interface';
import { ref } from 'vue';
import { loadingStatus, useStatus } from '@/core';

export const useProfileRelationInfosStore = defineStore('profile-relation-infos', () => {
  const relations = ref<ProfileRelationInfos>({ profiles: [] });
  const profilesRelationInfosClient = useProfileRelationInfosClient();
  const status = useStatus();

  async function getRelations(force = false): Promise<ProfileRelationInfos> {
    return !force && status.isStatusSuccess() ? Promise.resolve(relations.value) : loadRelations();
  }

  async function loadRelations() {
    return loadingStatus(
      profilesRelationInfosClient.getAllProfileRelationInfos(),
      status,
      undefined,
      (result) => {
        relations.value = result;
      },
    );
  }

  function removeRelation(pid: string) {
    relations.value.profiles = relations.value.profiles.filter((p) => p.id !== pid);
  }

  function addRelation(relation: ProfileRelationInfo) {
    relations.value?.profiles.push(relation);
  }

  return {
    ...status,
    getRelations,
    addRelation,
    loadRelations,
    removeRelation,
  };
});
