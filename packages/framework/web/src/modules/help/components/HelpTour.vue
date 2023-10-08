<script lang="ts" setup>
import 'intro.js/minified/introjs.min.css';
import { onMounted, watch, ref, unref, onUnmounted } from 'vue';
import introJs from 'intro.js';

export interface IProps {
  modelValue: boolean;
  steps: Array<any>;
}

const props = defineProps<IProps>();

const emit = defineEmits(['update:modelValue']);
const tour = introJs().addSteps(props.steps);

tour.onexit(() => {
  emit('update:modelValue', false);
});

watch(
  () => ref(props),
  (newValue) => {
    if (newValue) {
      introJs().addSteps(unref(props.steps)).start();
    } else {
      introJs().exit(true);
    }
  },
);

onMounted(() => {
  if (props.modelValue) tour.start();
});

onUnmounted(() => tour.exit(true));
</script>

<template><template /></template>

<style scoped></style>
