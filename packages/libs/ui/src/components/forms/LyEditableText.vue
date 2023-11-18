<script lang="ts" setup>
import { HTMLAttributes, onMounted, Ref, ref } from 'vue';
import { useFloatingInputSetup } from './FloatingInput';
import { t, Translatable } from '@/i18n';
import LyButton from "@/components/buttons/LyButton.vue";
import LyMarkdownView from "@/components/markdown/LyMarkdownView.vue";

export interface IProps {
  id?: string;
  label?: Translatable;
  helpText?: Translatable;
  name?: string;
  modelValue?: any;
  value?: string;
  property?: string;
  placeholder?: Translatable;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  inputClass?: HTMLAttributes['class'];
  inputStyle?: HTMLAttributes['style'];
  wrapperClass?: HTMLAttributes['class'];
  autofocus?: boolean;
  autocomplete?: boolean | string;
  ariaDescribedby?: string;
  error?: string;
  loading?: boolean;
  autoValidation?: boolean;
  maxlength: number;
  rows: number;
}

const props = withDefaults(defineProps<IProps>(), {
  id: undefined,
  label: undefined,
  modelValue: undefined,
  helpText: undefined,
  property: undefined,
  placeholder: undefined,
  name: undefined,
  disabled: false,
  readonly: false,
  required: false,
  autocomplete: false,
  autofocus: false,
  autoValidation: true,
  loading: false,
  ariaDescribedby: undefined,
  inputClass: undefined,
  inputStyle: undefined,
  wrapperClass: undefined,
  error: undefined,
  value: undefined,
  maxlength: undefined,
  rows: undefined,
});

const emit = defineEmits(['change', 'update:modelValue']);

const input = ref<HTMLInputElement>() as Ref<HTMLInputElement>;
const isEdit = ref(false);
const editValue = ref('');

const { inputId, inputValue, inputClass, onChange, onFocusOut } = useFloatingInputSetup(
  props,
  emit,
);

onMounted(() => {
  if (props.autofocus) setTimeout(() => input.value?.focus());
});

function edit() {
  isEdit.value = true;
  editValue.value = props.modelValue;
  setTimeout(() => {
    input.value.focus();
  });
}

function save(evt: KeyboardEvent) {
  if (evt.key === 's') {
    evt.preventDefault();
    evt.stopImmediatePropagation();
    submit();
  }
}

function submit() {
  inputValue.value = editValue.value;
  isEdit.value = false;
}

function cancel() {
  isEdit.value = false;
}
</script>
<template>
  <div class="cursor-pointer text-main">
    <div v-if="!isEdit" class="flex gap-2 justify-between" @click="edit">
      <div class="flex-grow">
        <template v-if="inputValue?.length">
          <ly-markdown-view :md="inputValue" />
        </template>
        <template v-else-if="placeholder">
          <span class="text-dimmed">{{ t(placeholder) }}</span>
        </template>
      </div>
      <div class="flex flex-col justify-end">
        <a class="text-secondary text-xs">{{ t('common.edit') }}</a>
      </div>
    </div>
    <div v-else class="flex flex-col gap-1">
      <div class="flex-grow">
        <textarea
          :id="inputId"
          :data-id="inputId"
          ref="input"
          v-model="editValue"
          :placeholder="t(placeholder)"
          :aria-describedby="ariaDescribedby"
          :rows="rows"
          :disabled="disabled"
          :readonly="readonly"
          :class="inputClass"
          :style="inputStyle"
          :maxlength="maxlength"
          @keydown.ctrl="save"
          @change="onChange"
          @focusout="onFocusOut"></textarea>
      </div>
      <div class="flex gap-1 justify-end">
        <ly-button class="secondary text-xs" @click="cancel">{{ t('common.cancel') }}</ly-button>
        <ly-button class="primary text-xs" @click="submit">{{ t('common.submit') }}</ly-button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
