<template>
  <floating-input-layout
    :wrapper-class="wrapperClass"
    :input-id="inputId"
    :label="label"
    :required="required"
    :input-error="inputError"
  >
    <textarea
      :id="inputId"
      ref="input"
      v-model="inputValue"
      :aria-describedby="ariaDescribedby"
      :rows="rows"
      :disabled="disabled"
      :readonly="readonly"
      :class="inputClass"
    ></textarea>
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
  inject: ["model", "validator"],
  props: {
    ...useBaseInputProps(),
    rows: { type: Number, default: 3 },
  },
  emits: ["change", "update:modelValue"],
  setup(props: IProps, context: SetupContext) {
    return useFloatingInputSetup(props, context);
  },
  mounted() {
    if (this.autofocus) this.$refs.input.focus();
  },
};
</script>

<style scoped></style>
