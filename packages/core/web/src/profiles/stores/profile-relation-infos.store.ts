import { defineStore } from 'pinia';
import {
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

  async function getRelations(): Promise<ProfileRelationInfos> {
    return status.isStatusSuccess() ? Promise.resolve(relations.value) : loadRelations();
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

  function addRelation(relation: ProfileRelationInfo) {
    relations.value?.profiles.push(relation);
  }

  return {
    ...status,
    getRelations,
    addRelation,
    loadRelations,
  };
});
