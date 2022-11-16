<template>
  <floating-input-layout
    :wrapper-class="wrapperClass"
    :input-id="inputId"
    :label="label"
    :required="required"
    :help-text="helpText"
    :input-error="inputError"
  >
    <textarea
      :id="inputId"
      ref="input"
      v-model="inputValue"
      :placeholder="placeholder"
      :aria-describedby="ariaDescribedby"
      :rows="rows"
      :disabled="disabled"
      :readonly="readonly"
      :class="inputClass"
      :maxlength="maxlength"
    ></textarea>
  </floating-input-layout>
</template>

<script lang="ts">
import { IBaseInputProps, useBaseInputProps } from '@/modules/ui/components/form/BaseInput';
import { useFloatingInputSetup } from '@/modules/ui/components/form/FloatingInput';
import { SetupContext } from 'vue';
import FloatingInputLayout from '@/modules/ui/components/form/FloatingInputLayout.vue';

export default {
  components: { FloatingInputLayout },
  inject: ['model', 'validator'],
  props: {
    ...useBaseInputProps(),
    rows: { type: Number, default: 3 },
    maxlength: { type: Number, default: undefined },
  },
  emits: ['change', 'update:modelValue'],
  setup(props: IBaseInputProps, context: SetupContext) {
    return useFloatingInputSetup<string>(props, context);
  },
  mounted() {
    if (this.autofocus) this.$refs.input.focus();
  },
};
</script>

<style scoped></style>
