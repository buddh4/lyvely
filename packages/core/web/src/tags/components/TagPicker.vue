<script lang="ts" setup>
import { computed } from 'vue';
import { uniqueId } from 'lodash';
import { translation } from '@/i18n';
import { useProfileStore } from '@/profiles/stores/profile.store';
import { TagModel } from '@lyvely/interface';
import { storeToRefs } from 'pinia';

export interface IProps {
  modelValue: Array<string> | undefined;
  optionKey?: 'id' | 'name';
  inputId?: string;
  multiple?: boolean;
  label?: string;
}

const props = withDefaults(defineProps<IProps>(), {
  inputId: uniqueId('tag-picker'),
  optionKey: 'id',
  multiple: true,
  label: translation('tags.chooser.label'),
});

const { profile } = storeToRefs(useProfileStore());

const options = computed(
  () =>
    profile.value!.tags?.map((tag: TagModel) => ({
      key: props.optionKey === 'id' ? tag.id : tag.name,
      label: tag.name,
      color: tag.color,
    })) || [],
);

const emit = defineEmits(['update:modelValue']);

const model = computed({
  get: () => props.modelValue || [],
  set: (value: Array<string>) => emit('update:modelValue', value),
});
</script>

<template>
  <ly-badge-picker
    v-model="model"
    :input-id="inputId"
    :options="options"
    :multiple="multiple"
    :label="label"
    :add="true" />
</template>

<style scoped></style>
