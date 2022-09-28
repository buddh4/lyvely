<script lang="ts" setup>
import { computed } from "vue";

const emit = defineEmits(["update:modelValue"]);

interface IProps {
  icon?: string;
  iconColor?: string;
  iconClass?: string;
  modelValue: boolean;
  title: string;
  message: string;
}

const props = withDefaults(defineProps<IProps>(), {
  icon: undefined,
  iconColor: undefined,
  iconClass: undefined,
});

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});
</script>

<template>
  <ly-modal
    v-model="visible"
    v-bind="props"
    :title="title"
    cancel-button-class="primary"
    cancel-button-text="common.close"
    :back-button="false"
    :submit-button="false"
  >
    {{ $t(message) }}
  </ly-modal>
</template>

<style scoped></style>
