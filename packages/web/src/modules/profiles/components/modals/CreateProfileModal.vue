<script lang="ts" setup>
import { useCreateProfileStore } from "@/modules/profiles/stores/create-profile.store";
import { storeToRefs } from "pinia";
import { ProfileUsage, ProfileType } from "@lyvely/common";
import VueMultiselect from "vue-multiselect";
import { translate } from "@/i18n";
import LyInputTextarea from "@/modules/ui/components/form/TextareaInput.vue";
import LyScreenReaderValidationError from "@/modules/ui/components/error/ScreenReaderValidationError.vue";

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
  ProfileUsage.Improvement,
];
const usageLabel = (usage: ProfileUsage) =>
  translate("profile.usage." + usage.toLowerCase());
</script>

<template>
  <ly-modal
    v-model="show"
    title="profile.create.title"
    @cancel="reset"
    @submit="submit"
  >
    <ly-form-model
      v-model="model"
      label-key="profile.create.properties"
      :validator="validator"
    >
      <ly-input-text property="name" :required="true" />
      <ly-input-textarea property="description" />
      <VueMultiselect
        v-model="model.usage"
        class="form-input"
        :custom-label="usageLabel"
        :placeholder="$t('profile.create.placeholders.usage')"
        track-by="key"
        :options="usageOptions"
        :multiple="true"
        tag-placeholder="Add this as new tag"
      />
      <ly-input-radio
        property="type"
        label="profile.create.properties.user"
        :value="userType"
      />
      <ly-input-radio
        property="type"
        label="profile.create.properties.group"
        :value="groupType"
      />
    </ly-form-model>
    <ly-alert :message="error" class="mt-2" />
  </ly-modal>
</template>

<style scoped></style>
