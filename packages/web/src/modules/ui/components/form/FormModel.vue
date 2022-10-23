<script lang="ts" setup>
import { provide } from 'vue';
import { ModelValidator } from '@lyvely/common';
import { StoreStatusPlugin } from '@/store';
import { IFormModelData } from '@/modules/ui/components/form/BaseInput';

export interface IProps {
  id?: string;
  modelValue: object;
  validator?: ModelValidator;
  labelKey?: string;
  status?: StoreStatusPlugin;
  autoValidation?: boolean;
  showAlert?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  id: undefined,
  validator: undefined,
  labelKey: undefined,
  status: undefined,
  autoValidation: true,
  showAlert: true,
});

provide('formModelData', {
  id: props.id,
  model: props.modelValue,
  labelKey: props.labelKey,
  validator: props.validator,
  autoValidation: props.autoValidation,
} as IFormModelData);
</script>

<template>
  <div :id="id" class="form-model">
    <slot></slot>
    <ly-screen-reader-validation-error v-if="validator" :errors="validator.getErrors()" />
    <ly-alert v-if="showAlert" :message="status?.statusError" />
  </div>
</template>

<style scoped></style>
