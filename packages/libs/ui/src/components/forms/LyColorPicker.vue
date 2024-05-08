<script setup lang="ts">
import { Sketch } from '@ckpack/vue-color';
import type { ColorInput } from '@ctrl/tinycolor';
import { computed, Ref, ref } from 'vue';
import randomColor from 'randomcolor';

interface IProps {
  modelValue: string | undefined;
  position: 'top' | 'bottom';
  showHex?: boolean;
  presetColors?: ColorInput[];
  disableAlpha?: boolean;
  disableFields?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  presetColors: undefined,
  position: 'bottom',
  showHex: true,
  disableAlpha: true,
  disableFields: false,
});

const emit = defineEmits(['update:modelValue']);

const defaultColor = randomColor({ luminosity: 'dark' });

const showColorPicker = ref(false);
const colorInput = ref(null) as Ref<HTMLElement | null>;
const colorPicker = ref(null) as Ref<HTMLElement | null>;
const colorPickerStyle = ref({ top: '0', left: '0' });

const colorStyle = computed(() => ({
  'background-color': props.modelValue || defaultColor,
  width: '20px',
  height: '20px',
}));

function clickColorBox() {
  showColorPicker.value = true;
  setTimeout(() => {
    colorPickerStyle.value.top =
      props.position === 'top'
        ? -colorPicker.value!.offsetHeight - 2 + 'px'
        : colorInput.value!.offsetHeight + 2 + 'px';
    colorPickerStyle.value.left = '2px';
  });
}

const pickerValue = ref(props.modelValue || defaultColor);

function applyChange() {
  emit('update:modelValue', pickerValue.value);
  showColorPicker.value = false;
}

function cancel() {
  pickerValue.value = props.modelValue || defaultColor;
}

if (!props.modelValue) applyChange();

const colorValue = computed({
  get: () => pickerValue.value,
  set: (val: any) => (pickerValue.value = val.hex),
});
</script>

<template>
  <div
    ref="colorInput"
    class="flex space-x-2 mb-2 p-2 cursor-pointer rounded-md border border-divide shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
    @click="clickColorBox">
    <div class="inline-block rounded" :style="colorStyle">&nbsp;</div>
    <div v-if="showHex">{{ modelValue }}</div>
  </div>
  <ly-modal
    v-model="showColorPicker"
    width="auto"
    :show-header="false"
    @submit="applyChange"
    @cancel="cancel"
    submit-button-text="common.select"
    q>
    <div ref="colorPicker" class="flex items-center justify-center">
      <sketch
        v-model="colorValue"
        :preset-colors="presetColors"
        :disable-alpha="disableAlpha"
        :disable-fields="disableFields" />
    </div>
  </ly-modal>
</template>

<style scoped></style>
