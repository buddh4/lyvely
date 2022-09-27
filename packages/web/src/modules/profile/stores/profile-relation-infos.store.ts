import { defineStore } from 'pinia';
import { ProfileRelationInfo, ProfileRelationInfos } from "@lyvely/common";
import { ref } from 'vue';
import { loadingStatus, useStatus } from "@server/store/status";
import { useProfileRelationInfosService } from "@server/modules/profile/services/profile-relation-infos.service";

export const useProfileRelationInfosStore = defineStore('profile-relation-infos', () => {
  const relations = ref<ProfileRelationInfos>();
  const profilesRelationInfosService = useProfileRelationInfosService();
  const status = useStatus();

  async function getRelations() {
    return status.isStatusSuccess() ? relations : loadRelations();
  }

  async function loadRelations() {
    return loadingStatus(profilesRelationInfosService.getUserProfileInfos(), status, (result) => {
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
  }
});
