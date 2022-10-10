<template>
  <floating-input-layout :wrapper-class="wrapperClass" :input-id="inputId" :label="label" :required="required" :input-error="inputError">
    <select
        :id="inputId"
        ref="input"
        v-model="inputValue"
        :disabled="disabled"
        :class="inputClass"
    >
      <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
      >
        {{ $t(option.label) }}
      </option>
    </select>
  </floating-input-layout>
</template>

<script lang="ts">
import {
  IBaseInputProps,
  useBaseInputProps,
} from "@/modules/ui/components/form/BaseInput";
import { useFloatingInputSetup } from "@/modules/ui/components/form/FloatingInput";
import { SetupContext } from "vue";
import FloatingInputLayout from "@/modules/ui/components/form/FloatingInputLayout.vue";

interface IProps extends IBaseInputProps {
  type: string;
}

export default {
  components: { FloatingInputLayout },
  props: {
    ...useBaseInputProps(),
    options: { type: Array, required: true },
  },
  emits: ["change", "update:modelValue"],
  setup(props: IProps, context: SetupContext) {
    return useFloatingInputSetup(props, context);
  },
  mounted() {
    if(this.autofocus) this.$refs.input.focus()
  },
};
</script>

<style scoped></style>
