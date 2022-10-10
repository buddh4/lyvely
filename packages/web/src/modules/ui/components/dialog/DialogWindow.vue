<script lang="ts" setup>
import { computed } from "vue";

const emit = defineEmits(["update:modelValue"]);

interface IProps {
  icon?: string;
  iconColor?: string;
  iconClass?: string;
  modelValue: boolean;
  buttonType?: "close" | "reload";
  title: string;
  message: string;
}

const props = withDefaults(defineProps<IProps>(), {
  icon: undefined,
  iconColor: undefined,
  buttonType: "close",
  iconClass: undefined,
});

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const reload = () => {
  document.location = "/";
};
</script>

<template>
  <ly-modal
    v-model="visible"
    v-bind="props"
    :title="title"
    :back-button="false"
    :submit-button="false"
  >
    {{ $t(message) }}

    <template #footer>
      <ly-button
        v-if="buttonType === 'reload'"
        class="danger"
        text="common.reload"
        @click="reload"
      />
      <ly-button
        v-if="buttonType === 'close'"
        class="primary"
        text="common.close"
        @click="visible = false"
      />
    </template>
  </ly-modal>
</template>

<style scoped></style>
