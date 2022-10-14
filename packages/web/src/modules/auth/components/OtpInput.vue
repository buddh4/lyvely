<script lang="ts" setup>
import { ref, computed } from "vue";

interface IProps {
  modelValue: string;
  isValid?: boolean;
  email?: string;
  type?: "email";
}

const props = withDefaults(defineProps<IProps>(), {
  email: undefined,
  isValid: undefined,
  type: "email",
});

const emit = defineEmits(["update:modelValue", "update:isValid"]);

const otp = ref(Array.from({ length: 6 }, (_, i) => ""));

function onInput(i: number, evt: InputEvent) {
  evt.preventDefault();
  const value = getValueToSet(evt.data);
  otp.value[i] = value;

  if (value?.length) {
    const target = evt.target as HTMLInputElement;
    const otpIndex = parseInt(target.dataset.otp!);
    if (otpIndex < 6) {
      (<HTMLInputElement>(
        document.querySelector(`[data-otp="${otpIndex + 1}"]`)
      ))?.focus();
    }
    if (target.nextSibling instanceof HTMLInputElement) {
      target.nextSibling.focus();
    }
  }
  emitUpdate();
}

function onPaste(evt: ClipboardEvent) {
  evt.preventDefault();
  const clipboardData = evt.clipboardData;
  const text = clipboardData?.getData("Text")?.trim();
  if (text?.length) {
    otp.value = otp.value.map((v, i) => getValueToSet(text.charAt(i)));
  }
  emitUpdate();
}

function emitUpdate() {
  emit("update:modelValue", otp.value.join(""));
  emit("update:isValid", isValid.value);
}

const isValid = computed(
  () => otp.value.filter((f) => /^[0-9]$/.test(f)).length === otp.value.length
);

function getValueToSet(val?: string | null) {
  return typeof val === "string" && /^[0-9]$/.test(val) ? val : "";
}

const text = computed(() =>
  props.email ? "auth.otp.email.text_with_address" : "auth.otp.email.text"
);
</script>

<template>
  <fieldset>
    <i18n-t
      :keypath="text"
      tag="p"
      class="text-center text-dimmed text-sm mb-5"
    >
      <template #email>
        <b>{{ email }}</b>
      </template>
    </i18n-t>

    <div class="flex m-5 mt-0 justify-between">
      <template v-for="i in 6" :key="i">
        <input
          v-model="otp[i - 1]"
          type="text"
          :data-otp="i - 1"
          inputmode="number"
          maxlength="1"
          :aria-label="$t('auth.otp.aria.input_label')"
          aria-invlaid="false"
          :class="['rounded w-10 border-divide', { 'border-success': isValid }]"
          @paste="onPaste"
          @input="onInput(i - 1, $event)"
        />
        <div v-if="i === 3" class="flex items-center">
          <span class="font-bold">-</span>
        </div>
      </template>
    </div>
  </fieldset>
</template>

<style scoped></style>
