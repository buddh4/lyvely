<template>
  <div :class="wrapperClass">
    <textarea
      :id="id"
      v-model="inputValue"
      :rows="rows"
      :disabled="disabled"
      :readonly="readonly"
      :class="cssClasses"
    ></textarea>

    <div v-if="hasError()" :class="errorClass">
      {{ inputError }}
    </div>

    <label v-if="inputLabel" :for="id" :class="labelClass">
      {{ $t(inputLabel) }}
    </label>
  </div>
</template>

<script lang="ts">
import {
  IBaseInputProps,
  useBaseInputProps,
} from "@/modules/ui/components/form/BaseInput";
import { useFloatingInputSetup } from "@/modules/ui/components/form/FloatingInput";
import { SetupContext } from "vue";

interface IProps extends IBaseInputProps {
  type: string;
}

export default {
  inject: ["model", "validator"],
  props: {
    ...useBaseInputProps(),
    rows: { type: Number, default: 3 },
  },
  emits: ["change", "update:modelValue"],
  setup(props: IProps, context: SetupContext) {
    return useFloatingInputSetup(props, context);
  },
};
</script>

<style scoped></style>
