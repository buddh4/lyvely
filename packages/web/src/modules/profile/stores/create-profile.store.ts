import { defineStore } from 'pinia';

import { ref, computed, Ref } from 'vue';
import { CreateProfileDto, ModelValidator, ProfileRelationInfo } from "@lyvely/common";
import profileRepository from "@/modules/profile/repositories/profile.repository";
import { useProfileStore } from "@/modules/profile/stores/profile.store";
import { useProfileRelationsStore } from "@/modules/profile/stores/profile-relations.store";

export const useCreateProfileStore = defineStore('create-profile', () => {
  const show = ref(false);
  const model = ref(new CreateProfileDto());
  const validator = ref(new ModelValidator(model.value));
  const error = ref('');

  function reset() {
    model.value = new CreateProfileDto();
    validator.value.setModel(model.value);
  }

  async function submit() {
    if(await validator.value.validate()) {
      const { data: relation } = await profileRepository.createProfile(model.value);
      useProfileStore().loadProfile(relation.id);
      useProfileRelationsStore().addRelation(new ProfileRelationInfo(relation))
      show.value = false;
    }

  }

  return {
    show,
    model,
    validator,
    submit,
    error,
    reset,
  }
})

