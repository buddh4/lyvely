<script lang="ts" setup>
import { useCreateProfileStore } from "@/modules/profile/stores/create-profile.store";
import { storeToRefs } from 'pinia';
import Textarea from "@/modules/ui/components/form/Textarea.vue";
import FormModel from "@/modules/ui/components/form/FormModel.vue";
import TextInput from "@/modules/ui/components/form/TextInput.vue";
import RadioInput from "@/modules/ui/components/form/RadioInput.vue";
import Alert from "@/modules/ui/components/alert/Alert.vue";
import ScreenReaderValidationError from "@/modules/ui/components/error/ScreenReaderValidationError.vue";
import { ProfileUsage, ProfileType } from "@lyvely/common";
import VueMultiselect from 'vue-multiselect';
import { translate } from "@/i18n";

const createProfileStore = useCreateProfileStore();
const { show, model, validator, error } = storeToRefs(createProfileStore);
const { reset, submit } = createProfileStore;

const userType = ProfileType.User;
const groupType = ProfileType.Group;
const usageOptions = [
  ProfileUsage.Business,
  ProfileUsage.Private,
  ProfileUsage.Health,
  ProfileUsage.School,
  ProfileUsage.Family,
  ProfileUsage.Improvement];
const usageLabel = (usage: ProfileUsage) => translate('profile.usage.'+usage.toLowerCase());
</script>

<template>
  <Modal v-model="show" title="profile.create.title" @cancel="reset" @submit="submit">
    <FormModel v-model="model" label-key="profile.create.properties" :validator="validator">
      <TextInput property="name" :required="true" />
      <Textarea  property="description" />
      <VueMultiselect
          v-model="model.usage"
          class="form-input"
          :custom-label="usageLabel"
          :placeholder="$t('profile.create.placeholders.usage')"
          track-by="key"
          :options="usageOptions"
          :multiple="true"
          tag-placeholder="Add this as new tag" placeholder="Search or add a tag"/>
      <RadioInput property="type" label="profile.create.properties.user" :value="userType" />
      <RadioInput property="type" label="profile.create.properties.group" :value="groupType" />
    </FormModel>
    <Alert :message="error" class="mt-2" />
    <ScreenReaderValidationError :errors="validator.getErrors()" />
  </Modal>
</template>

<style scoped>

</style>
