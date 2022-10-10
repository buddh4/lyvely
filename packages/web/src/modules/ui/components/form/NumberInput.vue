<template>
  <floating-input-layout
    :wrapper-class="wrapperClass"
    :input-id="inputId"
    :label="label"
    :required="required"
    :input-error="inputError"
  >
    <input
      :id="inputId"
      ref="input"
      v-model.number="inputValue"
      :disabled="disabled"
      :readonly="readonly"
      :class="inputClass"
      type="text"
      inputmode="number"
      @change="$emit('change')"
    />
    <div v-if="slider && editable" class="number-slider">
      <ly-button :class="buttonClass" @click="increment">+</ly-button>
      <ly-button :class="buttonClass" @click="decrement">-</ly-button>
    </div>
  </floating-input-layout>
</template>

<script lang="ts">
import {
  IBaseInputProps,
  useBaseInputProps,
} from "@/modules/ui/components/form/BaseInput";
import { useFloatingInputSetup } from "@/modules/ui/components/form/FloatingInput";
import { computed, SetupContext } from "vue";
import FloatingInputLayout from "@/modules/ui/components/form/FloatingInputLayout.vue";

interface IProps extends IBaseInputProps {
  steps: number;
  slider: boolean;
  min?: number;
  max?: number;
}

export default {
  components: { FloatingInputLayout },
  props: {
    ...useBaseInputProps(),
    steps: { type: Number, default: 1 },
    slider: { type: Boolean, default: true },
    min: { type: Number, default: undefined },
    max: { type: Number, default: undefined },
  },
  emits: ["change", "update:modelValue"],
  setup(props: IProps, context: SetupContext) {
    const baseInput = useFloatingInputSetup<number>(props, context);

    baseInput.inputValue = computed({
      get: () => {
        let allowed = getAllowedVal(props.modelValue);
        if (props.modelValue !== allowed) {
          context.emit("update:modelValue", allowed);
        }
        return props.modelValue;
      },
      set: (val: number) => {
        if (!baseInput.editable) {
          return;
        }

        val = val || 0;
        val = parseInt(val + "");

        context.emit("change", val);
        const setValue = baseInput.hasFocus.value ? val : getAllowedVal(val);
        context.emit("update:modelValue", setValue);
      },
    });

    function getAllowedVal(val: number): number {
      if (props.min !== undefined) {
        val = Math.max(props.min, val);
      }

      if (props.max !== undefined) {
        val = Math.min(props.max, val);
      }
      return val;
    }

    function increment() {
      baseInput.inputValue.value = baseInput.inputValue.value + props.steps;
    }

    function decrement() {
      baseInput.inputValue.value = baseInput.inputValue.value - props.steps;
    }

    const buttonClass =
      "w-5 h-5 mr-2 bg-main border border-divide rounded-full flex justify-center items-center text-sm p0";

    return {
      ...baseInput,
      increment,
      decrement,
      buttonClass,
    };
  },
  mounted() {
    if (this.autofocus) this.$refs.input.focus();
  },
};
</script>

<style scoped></style>
