<script lang="ts" setup>
import { computed } from 'vue';
import { uniqueId } from '@lyvely/common';
import { translation } from '@/i18n';
import { useProfileStore } from '@/profiles/stores/profile.store';
import { storeToRefs } from 'pinia';
import { ProfileRelationModel, isMultiUserProfile } from '@lyvely/interface';

export interface IProps {
  modelValue: Array<string> | undefined;
  inputId?: string;
  max?: number;
  label?: string;
}

const props = withDefaults(defineProps<IProps>(), {
  inputId: uniqueId('profile-relation-picker'),
  label: translation('profiles.ui.relations.picker.title'),
  max: 100,
});

const { profile } = storeToRefs(useProfileStore());

const options = computed(
  () =>
    profile.value!.profileRelations?.map((relation: ProfileRelationModel) => ({
      key: relation.uid,
      label: relation.userInfo.displayName,
      avatar: { guid: relation.userInfo.guid },
    })) || []
);

const emit = defineEmits(['update:modelValue']);

const model = computed({
  get: () => props.modelValue || [],
  set: (value: Array<string>) => emit('update:modelValue', value),
});
</script>

<template>
  <ly-picker
    v-if="isMultiUserProfile(profile)"
    v-model="model"
    :input-id="inputId"
    :max="max"
    :provider="options"
    :label="label"
    :add="true" />
</template>

<style scoped></style>
