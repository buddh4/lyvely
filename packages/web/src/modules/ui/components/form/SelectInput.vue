<template>
  <div :class="wrapperClass">
    <select
      :id="id"
      v-model="inputValue"
      :disabled="disabled"
      :class="cssClasses"
    >
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ $t(option.label) }}
      </option>
    </select>

    <div v-if="hasError()" :class="errorClass">
      {{ $t(error) }}
    </div>

    <label :for="id" :class="labelClass">{{ $t(label) }}</label>
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
  props: {
    ...useBaseInputProps(),
    options: { type: Array, required: true },
  },
  emits: ["change", "update:modelValue"],
  setup(props: IProps, context: SetupContext) {
    return useFloatingInputSetup(props, context);
  },
};
</script>

<style scoped></style>
