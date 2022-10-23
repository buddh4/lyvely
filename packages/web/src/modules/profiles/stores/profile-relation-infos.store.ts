import { defineStore } from 'pinia';
import { ProfileRelationInfo, ProfileRelationInfos } from '@lyvely/common';
import { ref } from 'vue';
import { loadingStatus, useStatus } from '@/store';
import { useProfileRelationInfosService } from '@/modules/profiles/services/profile-relation-infos.service';

export const useProfileRelationInfosStore = defineStore('profile-relation-infos', () => {
  const relations = ref<ProfileRelationInfos>({ profiles: [] });
  const profilesRelationInfosService = useProfileRelationInfosService();
  const status = useStatus();

  async function getRelations(): Promise<ProfileRelationInfos> {
    return status.isStatusSuccess() ? Promise.resolve(relations.value) : loadRelations();
  }

  async function loadRelations() {
    return loadingStatus(profilesRelationInfosService.getUserProfileInfos(), status, undefined, (result) => {
      relations.value = result;
    });
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
