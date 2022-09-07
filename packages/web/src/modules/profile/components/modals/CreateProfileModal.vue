<script lang="ts" setup>
import { useCreateProfileStore } from "@/modules/profile/stores/create-profile.store";
import { storeToRefs } from 'pinia';
import Textarea from "@/modules/ui/components/form/Textarea.vue";
import FormModel from "@/modules/ui/components/form/FormModel.vue";
import TextInput from "@/modules/ui/components/form/TextInput.vue";
import RadioInput from "@/modules/ui/components/form/RadioInput.vue";
import Alert from "@/modules/ui/components/alert/Alert.vue";
import ScreenReaderValidationError from "@/modules/ui/components/error/ScreenReaderValidationError.vue";
import { ProfileType } from "@lyvely/common";

const createProfileStore = useCreateProfileStore();
const { show, model, validator, error } = storeToRefs(createProfileStore);
const { reset, submit } = createProfileStore;

const userType = ProfileType.User;
const groupType = ProfileType.Group;
</script>

<template>
  <Modal v-model="show" title="profile.create.title" @cancel="reset" @submit="submit">
    <FormModel v-model="model" label-key="profile.create.properties" :validator="validator">
      <TextInput property="name" :required="true" />
      <Textarea  property="description" :required="true" />
      <RadioInput property="type" label="profile.create.properties.user" :value="userType" />
      <RadioInput property="type" label="profile.create.properties.group" :value="groupType" />
    </FormModel>
    <Alert :message="error" class="mt-2" />
    <ScreenReaderValidationError :errors="validator.getErrors()" />
  </Modal>
</template>

<style scoped>

</style>
