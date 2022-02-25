<template>
  <label class="inline-flex items-center">
    <input
      type="checkbox"
      :disabled="disabled"
      :value="value"
      :checked="isChecked"
      :class="cssClasses"
      :readonly="readonly"
      @change="$emit('change', $event)"/>
      <span v-if="label" class="label ml-2">{{ $t(label) }}</span>
  </label>
</template>

<script lang="ts">
import { BaseInputProps, useBaseInputProps, useBaseInputSetup } from '@/modules/ui/components/form/BaseInput';
import { computed, SetupContext } from 'vue';

interface Props extends BaseInputProps {
  checked: boolean
}

export default {
  props: {
    ...useBaseInputProps(),
    checked: {type: Boolean},
  },
  emits: ['change', 'update:modelValue'],
  setup(props: Props, context: SetupContext) {
    const isChecked = computed({
      get: () => {
        if(props.checked !== undefined) {
          return props.checked;
        }
        return props.modelValue;
      },
      set: (val) => {
        if(props.checked !== undefined) {
          // eslint-disable-next-line vue/no-mutating-props
          props.checked = val;
        } else {
          context.emit('update:modelValue', val);
        }
      }
    })
    return {
      ...useBaseInputSetup<boolean>(props, context, {cssClass: 'border rounded ml-1 ring-0'}),
      isChecked
    }
  }
}
</script>

<style scoped></style>
