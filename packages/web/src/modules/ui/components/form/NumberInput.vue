<script lang="ts">
import { BaseInputProps, useBaseInputProps } from '@/modules/ui/components/form/BaseInput';
import { useFloatingInputSetup } from '@/modules/ui/components/form/FloatingInput';
import { computed, SetupContext } from 'vue';
import Button from '@/modules/ui/components/button/Button.vue';

interface Props extends BaseInputProps {
  steps: number,
  slider: boolean,
  min?: number,
  max?: number
}

export default {
  components: { Button },
  props: {
    ...useBaseInputProps(),
    steps: { type: Number, default: 1 },
    slider: {type: Boolean, default: true},
    min: { type: Number, default: undefined },
    max: { type: Number, default: undefined },
  },
  emits: ['change', 'update:modelValue'],
  setup(props: Props, context: SetupContext) {
    const baseInput = useFloatingInputSetup<number>(props, context);

    baseInput.value = computed({
      get: () => {
        let allowed = getAllowedVal(props.modelValue);
        if (props.modelValue !== allowed) {
          context.emit("update:modelValue", allowed);
        }
        return props.modelValue;
      },
      set: (val: number) => {
        if(!baseInput.editable) {
          return;
        }

        val = val || 0;
        val = parseInt(val+'');

        context.emit("change", val);
        const setValue = baseInput.hasFocus() ? val : getAllowedVal(val);
        context.emit("update:modelValue", setValue);
      }
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
      baseInput.value.value = baseInput.value.value + props.steps;
    }

    function decrement() {
      baseInput.value.value = baseInput.value.value - props.steps;
    }

    const buttonClass = 'secondary w-5 h-5 mr-2 text-gray-700 rounded-full flex justify-center items-center text-sm p0';

    return {
      ...baseInput,
      increment,
      decrement,
      buttonClass
    }
  }
}
</script>

<template>
  <div :class="wrapperClass">
    <input
      :id="id"
      v-model.number="value"
      :disabled="disabled"
      :readonly="readonly"
      :class="cssClasses"
      type="number"
      @change="$emit('change')"/>

    <div v-if="slider && editable" class="number-slider">
      <Button :class="buttonClass" @click="increment">+</Button>
      <Button :class="buttonClass" @click="decrement">-</Button>
    </div>

    <div v-if="hasError()" :class="errorClass">
      {{ $t(error) }}
    </div>

    <label :for="id" :class="labelClass">{{ $t(label) }}</label>
  </div>
</template>

<style scoped>
.number-slider {
  position: absolute;
  top: 28px;
  right: 10px;
  display: flex;
}
</style>
