<template>
  <div :class="wrapperClass">
    <input
      :id="id"
      v-model="value"
      :disabled="disabled"
      :readonly="readonly"
      :autocomplete="autocomplete ? 'on' : 'off'"
      :type="type"
      :class="cssClasses"
      @change="$emit('change', $event)"/>

    <div v-if="hasError()" :class="errorClass">
      {{ $t(error) }}
    </div>

    <label :for="id" :class="labelClass">{{ $t(label) }}</label>
  </div>
</template>

<script lang="ts">
import { BaseInputProps, useBaseInputProps } from '@/modules/ui/components/form/BaseInput';
import { useFloatingInputSetup } from '@/modules/ui/components/form/FloatingInput';
import { SetupContext } from 'vue';

interface Props extends BaseInputProps {
  type: string
}

export default {
  props: {
    ...useBaseInputProps(),
    type: {type: String, default: 'text'}
  },
  emits: ['change', 'update:modelValue'],
  setup(props: Props, context: SetupContext) {
    return useFloatingInputSetup(props, context)
  }
}
</script>

<style scoped></style>
