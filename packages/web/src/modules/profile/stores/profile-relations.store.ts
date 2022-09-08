import { defineStore } from 'pinia';
import { UserToProfileRelationDto } from "@lyvely/common";
import { ref } from 'vue';
import { Status, useStatus } from "@/store/status";
import profileRelationsRepository from '@/modules/profile/repositories/profile-relations.repository';

export const useProfileRelationsStore = defineStore('profile-relations', () => {
  const relations = ref<UserToProfileRelationDto[]>([]);
  const status = useStatus();

  async function getRelations() {
    return status.isStatusSuccess() ? relations : loadRelations();
  }

  async function loadRelations() {
    status.setStatus(Status.LOADING);
    try {
      const { data } = await profileRelationsRepository.getRelations();
      relations.value = data;
      status.setStatus(Status.SUCCESS);
    } catch (e) {
      status.setStatus(Status.ERROR);
    }

    return relations;
  }

  function addRelation(relation: UserToProfileRelationDto) {
    relations.value.push(relation);
  }

  return {
    ...status,
    getRelations,
    addRelation,
    loadRelations
  }
});
