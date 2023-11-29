<script lang="ts" setup>
import { computed } from 'vue';
import { IConfirmOptions } from './confirm-options.interface';
import { t, Translatable } from '@/i18n';
import LyModal from './LyModal.vue';

export interface IProps {
  modelValue: boolean;
  title?: Translatable;
  text?: Translatable;
  confirm?: Translatable;
  cancel?: Translatable;
  options?: IConfirmOptions;
}

const props = withDefaults(defineProps<IProps>(), {
  title: 'modal.confirm.default.title',
  text: 'modal.confirm.default.text',
  confirm: 'modal.confirm.default.confirm',
  cancel: 'common.cancel',
  options: undefined,
});

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel']);

const showModal = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
});

const confirmTitle = computed(() => props.options?.title || props.title);
const confirmCancel = computed(() => props.options?.cancel || props.cancel);
const confirmConfirm = computed(() => props.options?.confirm || props.confirm);
const confirmText = computed(() => props.options?.text || props.text);

function confirm() {
  showModal.value = false;
  emit('confirm');
}

function cancel() {
  showModal.value = false;
  emit('cancel');
}
</script>

<template>
  <ly-modal
    v-model="showModal"
    :title="confirmTitle"
    :cancel-button-text="confirmCancel"
    :submit-button-text="confirmConfirm"
    @submit="confirm"
    @cancel="cancel">
    <slot>{{ t(confirmText) }}</slot>
  </ly-modal>
</template>

<style scoped></style>
