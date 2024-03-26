<script setup lang="ts">
import {
  CHART_TEMPLATE_SCORE_TAG,
  CHART_TEMPLATE_SCORE_USER,
  ScoreChartSeriesConfigModel,
} from '@lyvely/analytics-interface';
import { ProfileRelationPicker, TagPicker } from '@lyvely/web';
import { LyCheckbox, useModel } from '@lyvely/ui';

const props = defineProps({
  modelValue: ScoreChartSeriesConfigModel<string>,
});

const emit = defineEmits(['update:modelValue']);

const { formValue } = useModel(props.modelValue!, emit);
</script>

<template>
  <div v-if="modelValue?.templateId === CHART_TEMPLATE_SCORE_USER">
    <profile-relation-picker v-model="formValue.uids" label="analytics.fields.users" />

    <tag-picker v-model="formValue.tagIds" label="analytics.fields.tags" />
    <ly-checkbox v-model="formValue.currentUser" label="analytics.fields.current-user" />
  </div>
  <div v-if="modelValue?.templateId === CHART_TEMPLATE_SCORE_TAG">
    <tag-picker v-model="formValue.tagIds" label="analytics.fields.tags" />
  </div>
</template>

<style scoped></style>
