import { defineStore } from 'pinia';
import { ProfileRelationInfo, ProfileRelationInfos } from "@lyvely/common";
import { ref } from 'vue';
import { Status, useStatus } from "@/store/status";
import { useProfileRelationInfosService } from "@/modules/profile/services/profile-relation-infos.service";

export const useProfileRelationInfosStore = defineStore('profile-relation-infos', () => {
  const relations = ref<ProfileRelationInfos>();
  const profilesRelationInfosService = useProfileRelationInfosService();
  const status = useStatus();

  async function getRelations() {
    return status.isStatusSuccess() ? relations : loadRelations();
  }

  async function loadRelations() {
    try {
      status.setStatus(Status.LOADING);
      relations.value = await profilesRelationInfosService.getUserProfileInfos();
      status.setStatus(Status.SUCCESS);
    } catch (e) {
      status.setError('error.unknown');
    }
    return relations;
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
