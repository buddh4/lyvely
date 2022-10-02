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
      @change="onChange"
      @focusout="onFocusOut"
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

interface IProps extends IBaseInputProps {
  type: string;
}

export default {
  props: {
    ...useBaseInputProps(),
    type: { type: String, default: "text" },
  },
  methods: {
    change: function(evt: any) {
      this.$emit('change', evt);
    }
  },
  emits: ["change", "update:modelValue"],
  setup(props: IProps, context: SetupContext) {
    return useFloatingInputSetup(props, context);
  },
};
</script>

<style scoped></style>
