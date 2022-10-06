<script lang="ts" setup>
import { provide, watch } from "vue";
import { ModelValidator } from "@lyvely/common";
import { StatusStorePlugin } from "@/store/status";
import { FormModelData } from "@/modules/ui/components/form/BaseInput";

interface IProps {
  modelValue: object;
  validator?: ModelValidator;
  labelKey?: string;
  status?: StatusStorePlugin;
  autoValidation?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  validator: undefined,
  labelKey: undefined,
  status: undefined,
  autoValidation: true
});

provide("formModelData", {
  model: props.modelValue,
  labelKey: props.labelKey,
  validator: props.validator,
  autoValidation: props.autoValidation
} as FormModelData);
</script>

<template>
  <div>
    <slot></slot>
    <ly-screen-reader-validation-error
      v-if="validator"
      :errors="validator.getErrors()"
    />
    <ly-alert :message="status?.statusError" />
  </div>
</template>

<style scoped></style>
