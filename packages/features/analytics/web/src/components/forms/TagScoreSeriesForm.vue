<script setup lang="ts">
import { TagPicker } from '@lyvely/web';
import { useModel } from '@lyvely/ui';
import { TagScoreSeriesConfigModel } from '@lyvely/analytics-interface';

const props = defineProps({
  modelValue: TagScoreSeriesConfigModel<string>,
});

const emit = defineEmits(['update:modelValue']);

const { formValue } = useModel(props.modelValue!, emit);
</script>

<template>
  <div>
    <tag-picker v-model="formValue.tagIds" label="analytics.fields.tags" />
  </div>
</template>

<style scoped></style>
