import { defineStore } from "pinia";

import { ref } from "vue";
import {
  CreateProfileDto,
  ModelValidator,
  ProfileRelationInfo,
} from "@lyvely/common";
import profileRepository from "@/modules/profiles/repositories/profile.repository";
import { useProfileStore } from "@/modules/profiles/stores/profile.store";
import { useProfileRelationInfosStore } from "@/modules/profiles/stores/profile-relation-infos.store";

export const useCreateProfileStore = defineStore("create-profile", () => {
  const show = ref(false);
  const model = ref(new CreateProfileDto());
  const validator = ref(new ModelValidator(model.value));
  const error = ref("");

  function reset() {
    model.value = new CreateProfileDto();
    validator.value.setModel(model.value);
  }

  async function submit() {
    debugger;
    if (await validator.value.validate()) {
      const { data: relation } = await profileRepository.createProfile(
        model.value
      );
      useProfileStore().loadProfile(relation.id);
      useProfileRelationInfosStore().addRelation(
        new ProfileRelationInfo(relation)
      );
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
  };
});
