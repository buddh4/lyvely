<script lang="ts" setup>
import { computed } from 'vue';
import { uniqueId } from '@lyvely/common';
import { translation } from '@/i18n';
import { useProfileStore } from '@/profiles/stores/profile.store';
import { TagModel } from '@lyvely/interface';
import { storeToRefs } from 'pinia';

export interface IProps {
  modelValue: Array<string> | undefined;
  optionKey?: 'id' | 'name';
  inputId?: string;
  max?: number;
  label?: string;
}

const props = withDefaults(defineProps<IProps>(), {
  inputId: uniqueId('tag-picker'),
  optionKey: 'id',
  max: 100,
  label: translation('tags.chooser.label'),
});

const { profile } = storeToRefs(useProfileStore());

const options = computed(
  () =>
    profile
      .value!.tags?.filter((tag: TagModel) => !tag.archived)
      .map((tag: TagModel) => ({
        key: props.optionKey === 'id' ? tag.id : tag.name,
        label: tag.name,
        color: tag.color,
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
    :id="inputId"
    v-model="model"
    :provider="options"
    :max="max"
    :label="label"
    :add="true" />
</template>

<style scoped></style>
