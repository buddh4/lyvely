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
      v-model="inputValue"
      :name="name"
      :disabled="disabled"
      :aria-describedby="ariaDescribedby"
      :readonly="readonly"
      :autocomplete="autoCompleteValue"
      :type="internalType"
      :class="inputClass"
      @change="onChange"
      @focusout="onFocusOut"
    />
    <div
      v-if="isPassword && passwordToggle"
      rolw="button"
      class="absolute flex top-1 right-2 cursor-pointer"
      :aria-label="$t(togglePasswordAriaLabel)"
      @click="togglePassword"
    >
      <ly-icon :name="togglePasswordIcon" />
    </div>
  </floating-input-layout>
</template>

<script lang="ts">
import {
  IBaseInputProps,
  useBaseInputProps,
} from "@/modules/ui/components/form/BaseInput";
import { useFloatingInputSetup } from "@/modules/ui/components/form/FloatingInput";
import { SetupContext, ref, computed } from "vue";
import FloatingInputLayout from "@/modules/ui/components/form/FloatingInputLayout.vue";

interface IProps extends IBaseInputProps {
  type: string;
}

export default {
  components: { FloatingInputLayout },
  props: {
    ...useBaseInputProps(),
    type: { type: String, default: "text" },
    passwordToggle: { type: Boolean, default: true },
  },
  emits: ["change", "update:modelValue", "toggleType"],
  setup(props: IProps, context: SetupContext) {
    const internalType = ref(props.type);
    const togglePasswordIcon = computed(() => {
      return internalType.value === "password" ? "eye" : "eye-slash";
    });
    const togglePasswordAriaLabel = computed(() => {
      return internalType.value === "password"
        ? "common.show_password"
        : "common.hide_password";
    });
    return {
      isPassword: props.type === "password",
      togglePasswordIcon,
      togglePasswordAriaLabel,
      internalType,
      ...useFloatingInputSetup(props, context),
    };
  },
  watch: {
    type(newType: string) {
      this.internalType = newType;
    },
  },
  mounted() {
    if (this.autofocus) this.$refs.input.focus();
  },
  methods: {
    togglePassword() {
      this.internalType =
        this.internalType === "password" ? "text" : "password";
      this.$emit("toggleType", this.internalType);
    },
    change: function (evt: any) {
      this.$emit("change", evt);
    },
  },
};
</script>
