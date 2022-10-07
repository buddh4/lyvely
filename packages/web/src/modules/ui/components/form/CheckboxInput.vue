<template>
  <div>
    <div class="flex">
      <label class="inline-flex items-center">
        <input
          v-model="state"
          type="checkbox"
          :disabled="disabled"
          :value="value"
          :class="cssClasses"
          :readonly="readonly"
          @keydown.enter.stop="toggle"
          @change="onChange"
        />
      </label>
      <span v-if="label" class="label ml-2">{{ $t(label) }}</span>
      <ly-icon
        v-if="showHelpText && helpText"
        name="info"
        class="text-info ml-1 cursor-pointer select-none"
        @click="showHelpText = !showHelpText"
      />
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
import { computed, SetupContext, ref } from "vue";
import { isArray } from "lodash";

interface IProps extends IBaseInputProps {
  checked: boolean;
  value: string;
}

export default {
  props: {
    ...useBaseInputProps(),
    checked: { type: Boolean },
    value: { type: String, default: "" },
  },
  emits: ["change", "update:modelValue"],
  setup(props: IProps, context: SetupContext) {
    const showHelpText = ref(false);

    function toggle(evt: any) {
      if (isArray(props.modelValue)) {
        context.emit(
          "update:modelValue",
          props.modelValue.filter((val) => val !== evt.target.value)
        );
      } else {
        context.emit("update:modelValue", !evt.target.checked);
      }
    }

    function onChange(evt: any) {
      context.emit("change", evt.target.checked, evt.target.value);
    }

    const state = computed({
      get: () => props.modelValue,
      set: (val: any) => {
        context.emit("update:modelValue", val);
      },
    });

    return {
      ...useBaseInputSetup<boolean>(props, context, {
        cssClass: "border rounded ml-1 ring-0",
      }),
      showHelpText,
      toggle,
      state,
      onChange,
    };
  },
};
</script>

<style scoped></style>
