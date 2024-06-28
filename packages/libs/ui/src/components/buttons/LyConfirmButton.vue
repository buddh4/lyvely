<script lang="ts" setup>
import { RouteLocationRaw } from 'vue-router';
import { IConfirmOptions } from '../dialogs/confirm-options.interface';
import { Translatable } from '@/i18n';
import { ref, useAttrs } from 'vue';
import LyConfirmModal from '@/components/dialogs/LyConfirmModal.vue';
import { omit } from '@lyvely/common';

defineOptions({
  inheritAttrs: false,
});

export interface IProps {
  submit?: boolean;
  text?: Translatable;
  active?: boolean;
  disabled?: boolean;
  loading?: boolean;
  isToggle?: boolean;
  route?: RouteLocationRaw;
  options?: IConfirmOptions;
}

const props = withDefaults(defineProps<IProps>(), {
  submit: false,
  active: false,
  text: '',
  disabled: false,
  loading: false,
  route: undefined,
  isToggle: false,
  options: undefined,
});

const attrs = useAttrs();

defineEmits(['click']);

const showConfirm = ref(false);

function onClick() {
  showConfirm.value = true;
}
</script>

<template>
  <ly-button v-bind="{ ...props, ...omit(attrs, 'options') }" @click="onClick">
    <slot />
  </ly-button>
  <ly-confirm-modal v-model="showConfirm" :options="options" @submit="$emit('click')">
    <slot name="confirmBody"></slot>
  </ly-confirm-modal>
</template>

<style></style>
