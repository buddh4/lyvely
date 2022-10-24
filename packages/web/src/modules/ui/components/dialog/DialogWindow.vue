<script lang="ts" setup>
import { computed } from 'vue';

export interface IProps {
  icon?: string;
  iconColor?: string;
  iconClass?: string;
  modelValue: boolean;
  buttonType?: 'close' | 'reload';
  title: string;
  message: string;
}

const props = withDefaults(defineProps<IProps>(), {
  icon: undefined,
  iconColor: undefined,
  buttonType: 'close',
  iconClass: undefined,
});

const emit = defineEmits(['update:modelValue']);

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

const modalBinds = computed(() => {
  return {
    icon: props.icon,
    iconColor: props.iconColor,
    iconClass: props.iconClass,
    title: props.title,
    message: props.message,
  };
});

const reload = () => {
  document.location.reload();
};
</script>

<template>
  <ly-modal v-model="visible" v-bind="modalBinds" :back-button="false" :submit-button="false">
    <template v-if="message">
      {{ $t(message) }}
    </template>

    <template #footer>
      <ly-button v-if="buttonType === 'reload'" class="danger" text="common.reload" @click="reload" />
      <ly-button v-if="buttonType === 'close'" class="primary" text="common.close" @click="visible = false" />
    </template>
  </ly-modal>
</template>

<style scoped></style>
