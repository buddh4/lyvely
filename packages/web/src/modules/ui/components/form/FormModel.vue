<script lang="ts" setup>
import { provide } from "vue";
import { ModelValidator } from "@lyvely/common";
import { StatusStorePlugin } from "@/store/status";
import { FormModelData } from "@/modules/ui/components/form/BaseInput";

interface IProps {
  id?: string;
  modelValue: object;
  validator?: ModelValidator;
  labelKey?: string;
  status?: StatusStorePlugin;
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

provide("formModelData", {
  id: props.id,
  model: props.modelValue,
  labelKey: props.labelKey,
  validator: props.validator,
  autoValidation: props.autoValidation,
} as FormModelData);
</script>

<template>
  <form :id="id">
    <slot></slot>
    <ly-screen-reader-validation-error
      v-if="validator"
      :errors="validator.getErrors()"
    />
    <ly-alert v-if="showAlert" :message="status?.statusError" />
  </form>
</template>

<style scoped></style>
