<template>
  <div :class="wrapperClass">
    <div class="flex">
      <label class="inline-flex items-center">
        <input
          :id="id"
          ref="input"
          v-model="inputValue"
          type="radio"
          :disabled="disabled"
          :value="value"
          :class="inputClass"
          :readonly="readonly"
          @change="onChange"
        />
        <span v-if="label" class="label ml-2">{{ $t(label) }}</span>
      </label>
    </div>
    <span v-if="showHelpText && helpText" class="text-sm text-dimmed">
      {{ $t(helpText) }}
    </span>
  </div>
</template>

<script lang="ts">
import {
  IBaseInputProps,
  useBaseInputProps,
  useBaseInputSetup,
} from "@/modules/ui/components/form/BaseInput";
import { SetupContext } from "vue";

type Props = IBaseInputProps;

export default {
  props: {
    ...useBaseInputProps(),
  },
  emits: ["change", "update:modelValue"],
  setup(props: Props, context: SetupContext) {
    return useBaseInputSetup(props, context);
  },
  mounted() {
    if(this.autofocus) this.$refs.input.focus()
  },
};
</script>

<style scoped></style>
