<script lang="ts" setup>
import { computed } from 'vue';
import { t } from '@/i18n';
import LyModal from '../modals/LyModal.vue';

export interface IProps {
  icon?: string;
  iconColor?: string;
  iconClass?: string;
  modelValue: boolean;
  buttonType?: 'close' | 'reload';
  title: string;
  message: string;
  translateTitle?: boolean;
  translateMessage?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  icon: undefined,
  iconColor: undefined,
  buttonType: 'close',
  iconClass: undefined,
  translateTitle: true,
  translateMessage: true,
});

const emit = defineEmits(['update:modelValue']);

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

const modalBinds = computed(() => {
  return {
    icon: props.icon,
    title: props.title,
    translate: props.translateTitle,
  };
});

const reload = () => {
  document.location.reload();
};
</script>

<template>
  <ly-modal v-model="visible" v-bind="modalBinds">
    <template v-if="message">
      {{ translateMessage ? t(message) : message }}
    </template>

    <template #footer>
      <ly-button
        v-if="buttonType === 'reload'"
        class="danger"
        label="common.reload"
        @click="reload" />
      <ly-button
        v-if="buttonType === 'close'"
        class="primary"
        label="common.close"
        @click="visible = false" />
    </template>
  </ly-modal>
</template>

<style scoped></style>
