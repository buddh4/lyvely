<script lang="ts" setup>
import Modal from "../modal/Modal.vue";
import { computed } from 'vue';

const emit = defineEmits(["show", 'update:modelValue']);

interface Props {
  icon?: string,
  iconColor?: string,
  iconClass?: string,
  modelValue: boolean,
  title: string,
  message: string,
  closeButtonText?: string
}

const props = withDefaults(defineProps<Props>(), {
  closeButtonText: 'Close',
  icon: undefined,
  iconColor: undefined,
  iconClass: undefined,
});

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>

<template>
  <Modal
    v-model="visible"
    v-bind="props"
    cancel-button-class="primary"
    cancel-button-text="Close"
    :back-button="false"
    :submit-button="false">
    <template #body>
      {{ $t(props.message) }}
    </template>
  </Modal>
</template>

<style scoped></style>
