<template>
  <section :class="wrapperClass">
    <label v-if="label" :for="id" class="form-label">{{ $t(label) }}</label>
    <input
      :id="id"
      ref="input"
      v-model="inputValue"
      :disabled="disabled"
      :step="step"
      :readonly="readonly"
      :class="inputClass"
      :style="inputStyle"
      :min="min"
      :max="max"
      type="range"
      @change="$emit('change')"
    />
  </section>
</template>

<script lang="ts">
import {
  IBaseInputProps,
  useBaseInputProps,
  useBaseInputSetup,
} from "@/modules/ui/components/form/BaseInput";
import { computed, SetupContext } from "vue";

interface IProps extends IBaseInputProps {
  type: string;
  min: number;
  max: number;
  step: number;
  width: string;
}

export default {
  props: {
    ...useBaseInputProps(),
    min: { type: Number, default: undefined },
    max: { type: Number, default: undefined },
    step: { type: Number, default: 1 },
    width: { type: String, default: "" },
  },
  emits: ["change", "update:modelValue"],
  setup(props: IProps, context: SetupContext) {
    const baseInput = useBaseInputSetup<number>(props, context);

    baseInput.inputValue = computed({
      get: () => {
        let allowed = getAllowedVal(props.modelValue);
        if (props.modelValue !== allowed) {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          baseInput.inputValue.value = allowed;
        }
        return props.modelValue;
      },
      set: (val) => {
        val = val || 0;
        val = parseInt(val);
        context.emit("change");
        context.emit("update:modelValue", getAllowedVal(val));
      },
    });

    function getAllowedVal(val: number): number {
      if (typeof props.min !== "undefined") {
        val = Math.max(props.min, val);
      }

      if (typeof props.max !== "undefined") {
        val = Math.min(props.max, val);
      }

      return val;
    }

    function inputStyle() {
      if (!props.width) {
        return {};
      }
      return { width: props.width };
    }

    return {
      ...baseInput,
      inputStyle,
    };
  },
  mounted() {
    if (this.autofocus) this.$refs.input.focus();
  },
};
</script>

<style scoped></style>
