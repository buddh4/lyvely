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
}

const props = defineProps<IProps>();

provide("formModelData", {
  model: props.modelValue,
  labelKey: props.labelKey,
  validator: props.validator
} as FormModelData);
</script>

<template>
  <slot></slot>
  <ly-screen-reader-validation-error
    v-if="validator"
    :errors="validator.getErrors()"
  />
  <ly-alert :message="status?.statusError?.value" />
</template>

<style scoped></style>
