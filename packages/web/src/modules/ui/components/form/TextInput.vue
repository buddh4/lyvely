<template>
  <div :class="wrapperClass">
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

    <transition name="fade">
      <div v-if="hasError()" :class="errorClass">
        {{ inputError }}
      </div>
    </transition>

    <label v-if="inputLabel" :for="id" :class="labelClass">
      {{ $t(inputLabel) }}
    </label>
  </div>
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
  emits: ["change", "update:modelValue"],
  setup(props: IProps, context: SetupContext) {
    return useFloatingInputSetup(props, context);
  },
  methods: {
    change: function (evt: any) {
      this.$emit("change", evt);
    },
  },
};
</script>

<style scoped>
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
