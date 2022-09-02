<script lang="ts" setup>
import Modal from "../modal/Modal.vue";
import { computed } from 'vue';

const emit = defineEmits(['update:modelValue']);

interface Props {
  icon?: string,
  iconColor?: string,
  iconClass?: string,
  modelValue: boolean,
  title: string,
  message: string,
}

const props = withDefaults(defineProps<Props>(), {
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
    :title="title"
    cancel-button-class="primary"
    cancel-button-text="common.close"
    :back-button="false"
    :submit-button="false">

    {{ $t(message) }}

  </Modal>
</template>

<style scoped></style>
