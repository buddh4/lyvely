<template>
  <fieldset :class="wrapperClass">
    <input
      :id="id"
      v-model="inputValue"
      :disabled="disabled"
      :readonly="readonly"
      :autocomplete="autocomplete ? 'on' : 'off'"
      :type="type"
      :class="cssClasses"
      @change="$emit('change', $event)"
    />

    <div v-if="hasError()" :class="errorClass">
      {{ inputError }}
    </div>

    <label v-if="inputLabel" :for="id" :class="labelClass">
      {{ $t(inputLabel) }}
    </label>
  </fieldset>
</template>

<script lang="ts">
import {
  IBaseInputProps,
  useBaseInputProps,
} from "@/modules/ui/components/form/BaseInput";
import { useFloatingInputSetup } from "@/modules/ui/components/form/FloatingInput";
import { SetupContext } from "vue";

interface Props extends IBaseInputProps {
  type: string;
}

export default {
  props: {
    ...useBaseInputProps(),
    type: { type: String, default: "text" },
  },
  emits: ["change", "update:modelValue"],
  setup(props: Props, context: SetupContext) {
    return useFloatingInputSetup(props, context);
  },
};
</script>

<style scoped></style>
