<script lang="ts" setup>
import 'intro.js/minified/introjs.min.css';
import { onMounted, watch, ref, onUnmounted, computed } from 'vue';
import introJs from 'intro.js';

export interface IProps {
  modelValue: boolean;
  steps: Array<any>;
}

const props = defineProps<IProps>();

const emit = defineEmits(['update:modelValue']);
const active = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
});

const tour = introJs().onexit(() => {
  active.value = false;
});

watch(
  () => props.modelValue,
  (val: boolean) => {
    if (!val) {
      tour.exit(true);
    } else {
      tour.addSteps(props.steps).start();
    }
  },
  {
    immediate: true,
  }
);
</script>

<template>
  <div class="hidden"></div>
</template>

<style scoped></style>
