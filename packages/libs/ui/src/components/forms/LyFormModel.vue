<script lang="ts" setup generic="TModel extends object = object">
import { provide } from 'vue';
import { IFormModelData } from './BaseInput';
import { ModelValidator } from '@lyvely/common';

const props = withDefaults(
  defineProps<{
    id?: string;
    modelValue: TModel;
    validator?: ModelValidator<any, any>;
    labelKey?: string;
    status?: { statusError?: string };
    autoValidation?: boolean;
    showAlert?: boolean;
  }>(),
  {
    id: undefined,
    validator: undefined,
    labelKey: undefined,
    status: undefined,
    autoValidation: true,
    showAlert: true,
  }
);

const validator = props.validator;

if (props.validator && !props.validator.getLabelKey() && props.labelKey) {
  props.validator.setLabelKey(props.labelKey);
}

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
    <ly-screen-reader-validation-error v-if="validator" :errors="validator.getErrorSummary()" />
    <ly-alert v-if="showAlert" type="danger" :text="status?.statusError" />
  </div>
</template>

<style scoped></style>
