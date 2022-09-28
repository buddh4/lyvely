<script lang="ts" setup>
import { provide } from "vue";
import { ModelValidator } from "@lyvely/common";

interface IProps {
  modelValue: object;
  validator?: ModelValidator;
  labelKey?: string;
}

const props = defineProps<IProps>();

provide("model", props.modelValue);
provide("labelKey", props.labelKey);
provide("validator", props.validator);
</script>

<template>
  <slot></slot>
</template>

<style scoped></style>
