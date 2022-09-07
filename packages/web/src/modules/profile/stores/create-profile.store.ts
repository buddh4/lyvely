import { defineStore } from 'pinia';

import { ref, computed, Ref } from 'vue';
import { CreateProfileDto, ModelValidator } from "@lyvely/common/src";
import profileRepository from "@/modules/profile/repositories/profile.repository";

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
      const { data: membership } = await profileRepository.createProfile(model.value);
      show.value = false;
      // TODO: auto select new
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

