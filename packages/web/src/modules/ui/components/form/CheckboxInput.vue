<template>
  <div :class="['cursor-pointer', wrapperClass]" @keydown.enter.prevent.stop="toggle">
    <div class="flex">
      <label class="inline-flex items-center">
        <input
          ref="checkbox"
          v-model="inputValue"
          :aria-describedby="ariaDescribedby"
          type="checkbox"
          :disabled="disabled"
          :value="value"
          :class="inputClass"
          :readonly="readonly"
          @change="onChange"
        />
      </label>
      <span v-if="label" class="label ml-2" @click="toggle">
        {{ $t(label) }}
      </span>
      <ly-icon
        v-if="hasHelpText"
        name="info"
        class="text-info-dark ml-1 cursor-pointer select-none"
        @click="showHelpText = !showHelpText"
      />
    </div>
    <ly-alert v-if="hasHelpText" v-show="showHelpText" :id="helpTextId" class="mt-2 text-xs" type="info">
      {{ translatedHelpText }}
    </ly-alert>
  </div>
</template>

<script lang="ts">
import { IBaseInputProps, useBaseInputProps, useBaseInputSetup } from '@/modules/ui/components/form/BaseInput';
import { SetupContext, ref } from 'vue';
import { isArray } from 'lodash';
import { useHelpText } from "@/modules/ui/components/form/help-text.util";

export interface IProps extends IBaseInputProps {
  checked?: boolean;
  value?: string;
}

export default {
  props: {
    ...useBaseInputProps(),
    checked: { type: Boolean, default: undefined },
    value: { type: String, default: '' },
  },
  emits: ['change', 'update:modelValue'],
  setup(props: IProps, context: SetupContext) {
    const checkbox = ref<HTMLInputElement>();

    const baseInput = useBaseInputSetup<boolean>(props, context, {
      inputClass: 'border rounded ml-1 ring-0',
    });

    function onChange(evt: any) {
      context.emit('change', evt.target.checked, evt.target.value);
    }

    function toggle(evt: Event, stop?: boolean) {
      if (stop) {
        evt.stopImmediatePropagation();
        evt.stopPropagation();
        evt.preventDefault();
      }

      if (isArray(props.modelValue)) {
        context.emit(
          'update:modelValue',
          props.modelValue.filter((val) => val !== checkbox.value!.value),
        );
      } else {
        baseInput.inputValue.value = !checkbox.value!.checked;
      }
    }

    return {
      toggle,
      ...useHelpText(baseInput.helpText.value),
      ...baseInput,
      checkbox,
      onChange,
    };
  },
  mounted() {
    if (this.autofocus) this.$refs.input.focus();
  },
};
</script>

<style scoped></style>
