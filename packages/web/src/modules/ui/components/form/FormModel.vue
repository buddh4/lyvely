<script lang="ts" setup>
import { provide, watch } from "vue";
import { ModelValidator } from "@lyvely/common";
import { StatusStorePlugin } from "@/store/status";

interface IProps {
  modelValue: object;
  validator?: ModelValidator;
  labelKey?: string;
  status?: StatusStorePlugin;
}

const props = defineProps<IProps>();

provide("model", props.modelValue);
provide("labelKey", props.labelKey);
provide("validator", props.validator);
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
