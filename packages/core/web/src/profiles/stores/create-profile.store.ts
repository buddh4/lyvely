import { defineStore } from 'pinia';
import { ref } from 'vue';
import { CreateProfileModel, ProfileRelationInfo, useProfilesClient } from '@lyvely/interface';
import { useProfileRelationInfosStore } from '@/profiles/stores/profile-relation-infos.store';
import { I18nModelValidator } from '@/i18n';

export const useCreateProfileStore = defineStore('create-profile', () => {
  const show = ref(false);
  const isOrganization = ref(false);
  const model = ref(new CreateProfileModel());
  const validator = ref(new I18nModelValidator(model.value));
  const error = ref('');
  const profilesClient = useProfilesClient();

  function reset() {
    model.value = new CreateProfileModel();
    validator.value.setModel(model.value);
    isOrganization.value = false;
  }

  async function submit(oid?: string) {
    if (await validator.value.validate()) {
      const relation = await profilesClient.create({ ...model.value, oid });
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
    isOrganization,
  };
});
