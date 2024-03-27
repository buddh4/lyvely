import { defineStore } from 'pinia';
import { ref } from 'vue';
import { CreateProfileModel, ProfileRelationInfo, useProfilesClient } from '@lyvely/interface';
import { ModelValidator } from '@lyvely/common';
import { useProfileRelationInfosStore } from '@/profiles/stores/profile-relation-infos.store';

export const useCreateProfileStore = defineStore('create-profile', () => {
  const show = ref(false);
  const model = ref(new CreateProfileModel());
  const validator = ref(new ModelValidator(model.value));
  const error = ref('');
  const profilesClient = useProfilesClient();

  function reset() {
    model.value = new CreateProfileModel();
    validator.value.setModel(model.value);
  }

  async function submit() {
    if (await validator.value.validate()) {
      const relation = await profilesClient.create(model.value);
      useProfileRelationInfosStore().addRelation(new ProfileRelationInfo(relation));
      show.value = false;
      reset();
      return relation;
    }
    return Promise.reject();
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
