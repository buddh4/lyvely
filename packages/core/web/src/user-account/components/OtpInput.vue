<script lang="ts" setup>
import { ref, computed, watchEffect } from 'vue';
import { isEmail } from 'class-validator';
import { t } from '@/i18n';

export interface IProps {
  modelValue: string;
  hasError?: boolean;
  subject?: string;
}

const props = withDefaults(defineProps<IProps>(), {
  subject: undefined,
  hasError: false,
});

const emit = defineEmits(['update:modelValue', 'update:isValid']);

const otp = ref(Array.from({ length: 6 }, () => ''));

const isValid = computed(
  () => otp.value.filter((f) => /^[0-9]$/.test(f)).length === otp.value.length,
);

watchEffect(() => {
  otp.value = Array.from({ length: 6 }, (_, i) => props.modelValue?.charAt(i) || '');
  emit('update:isValid', isValid.value);
});

function onInput(i: number, evt: Event) {
  evt.preventDefault();
  if (evt instanceof InputEvent) {
    const value = getValueToSet(evt.data);
    otp.value[i] = value;

    if (value?.length) {
      const target = evt.target as HTMLInputElement;
      const otpIndex = parseInt(target.dataset.otp!);
      if (otpIndex < 6) {
        (<HTMLInputElement>document.querySelector(`[data-otp="${otpIndex + 1}"]`))?.focus();
      }
      if (target.nextSibling instanceof HTMLInputElement) {
        target.nextSibling.focus();
      }
    }
    emitUpdate();
  }
}

function onPaste(evt: ClipboardEvent) {
  evt.preventDefault();
  const clipboardData = evt.clipboardData;
  const text = clipboardData?.getData('Text')?.trim();
  if (text?.length) {
    otp.value = otp.value.map((v, i) => getValueToSet(text.charAt(i)));
  }
  emitUpdate();
}

function onDelete(i: number) {
  if (!otp.value[i].length && i >= 1) {
    (<HTMLInputElement>document.querySelector(`[data-otp="${i - 1}"]`))?.focus();
  }
}

function focusNext() {
  const active = document.activeElement as HTMLInputElement;
  const i = parseInt(active?.dataset?.otp || '-1');
  (<HTMLInputElement>document.querySelector(`[data-otp="${i + 1}"]`))?.focus();
}

function focusPrev() {
  const active = document.activeElement as HTMLInputElement;
  const i = parseInt(active?.dataset?.otp || '7');
  (<HTMLInputElement>document.querySelector(`[data-otp="${i - 1}"]`))?.focus();
}

function emitUpdate() {
  emit('update:modelValue', otp.value.join(''));
  emit('update:isValid', isValid.value);
}

function getValueToSet(val?: string | null) {
  return typeof val === 'string' && /^[0-9]$/.test(val) ? val : '';
}

const text = computed(() =>
  isEmail(props.subject) ? 'otp.email.text_with_address' : 'otp.email.text',
);
</script>

<template>
  <fieldset>
    <i18n-t :keypath="text" tag="p" class="text-dimmed mb-5 text-center text-sm">
      <template #email>
        <b>{{ subject }}</b>
      </template>
    </i18n-t>

    <div class="m-5 mt-0 flex justify-between">
      <template v-for="i in 6" :key="i">
        <input
          v-model="otp[i - 1]"
          type="text"
          :data-otp="i - 1"
          :data-id="'otp-' + (i - 1)"
          inputmode="numeric"
          :aria-label="t('otp.aria.input_label')"
          aria-invlaid="false"
          :class="[
            'border-divide w-10 rounded',
            {
              'border-success': isValid && !hasError,
              'border-danger': hasError,
            },
          ]"
          @paste="onPaste"
          @keydown.delete="onDelete(i - 1)"
          @keydown.right="focusNext"
          @keydown.left="focusPrev"
          @input="onInput(i - 1, $event)" />
        <div v-if="i === 3" class="flex items-center">
          <span class="font-bold">-</span>
        </div>
      </template>
    </div>
  </fieldset>
</template>

<style scoped></style>
