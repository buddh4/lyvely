<template>
  <div :class="wrapperClass">
    <textarea
      :id="id"
      v-model="value"
      :rows="rows"
      :disabled="disabled"
      :readonly="readonly"
      :class="cssClasses">
    </textarea>

    <div v-if="hasError()" :class="errorClass">
      {{ $t(error) }}
    </div>

    <label v-if="label" :for="id" :class="labelClass">{{ $t(label) }}</label>
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
    rows: {type: Number, default: 3},
  },
  emits: ['change', 'update:modelValue'],
  setup(props: Props, context: SetupContext) {
    return useFloatingInputSetup(props, context)
  }
}
</script>

<style scoped></style>
