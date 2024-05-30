<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script lang="ts" setup>
import { RouteLocationRaw } from 'vue-router';
import { IConfirmOptions } from '../dialogs/confirm-options.interface';
import { Translatable } from '@/i18n';
import { ref } from 'vue';
import LyConfirmModal from '@/components/dialogs/LyConfirmModal.vue';

export interface IProps {
  submit?: boolean;
  text?: Translatable;
  active?: boolean;
  border?: boolean;
  disabled?: boolean;
  loading?: boolean;
  rounded?: boolean;
  isToggle?: boolean;
  outlined?: boolean;
  route?: RouteLocationRaw;
  options?: IConfirmOptions;
}

withDefaults(defineProps<IProps>(), {
  submit: false,
  active: false,
  border: true,
  text: '',
  disabled: false,
  loading: false,
  rounded: true,
  route: undefined,
  isToggle: false,
  outlined: false,
});

const showConfirm = ref(false);

function onClick() {
  showConfirm.value = true;
}
</script>

<template>
  <ly-button v-bind="$props" @click="onClick" />
  <ly-confirm-modal v-model="showConfirm" :options="options" @submit="$emit('click')">
    <slot name="confirmBody"></slot>
  </ly-confirm-modal>
</template>

<style></style>
