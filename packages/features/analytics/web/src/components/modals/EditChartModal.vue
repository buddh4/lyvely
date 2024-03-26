<script lang="ts" setup>
import { computed, ref, watchEffect } from 'vue';
import {
  TagPicker,
  ContentEditModalEmits,
  useContentEditModal,
  ICreateContentInitOptions,
  t,
} from '@lyvely/web';
import {
  LyModal,
  LyFormModel,
  LyTextField,
  LySelect,
  LyTextarea,
  isTouchScreen,
  LyAlert,
  LyButton,
  type ISelectOptions,
} from '@lyvely/ui';
import {
  ChartModel,
  ChartCategory,
  CreateChartModel,
  UpdateChartModel,
  useChartsClient,
} from '@lyvely/analytics-interface';
import { useChartTemplates } from '@/composables';
import ChartTemplateForm from '@/components/forms/ChartTemplateForm.vue';

export interface IProps {
  modelValue: boolean;
  content?: ChartModel;
  type: string;
  initOptions?: ICreateContentInitOptions;
}

const props = defineProps<IProps>();
const emit = defineEmits(ContentEditModalEmits);

const { isCreate, showModal, model, validator, submit, status } = useContentEditModal<
  ChartModel,
  CreateChartModel,
  UpdateChartModel
>(props, emit, {
  client: useChartsClient(),
});

const modalTitle = computed(() => {
  return isCreate.value ? `analytics.charts.create.title` : `analytics.charts.edit.title`;
});
</script>

<template>
  <ly-modal v-model="showModal" :title="modalTitle" @submit="submit" @cancel="$emit('cancel')">
    <template #preHeader><slot name="navigation"></slot></template>
    <ly-form-model
      v-model="model"
      :validator="validator"
      :status="status"
      label-key="common.fields">
      <fieldset>
        <ly-text-field
          property="title"
          :required="true"
          :autofocus="isCreate || !isTouchScreen()"
          :auto-validation="false" />
      </fieldset>

      <chart-template-form :key="model.templateId" v-model="model" :embedded="true" />

      <fieldset>
        <tag-picker v-model="model.tagNames" />
        <ly-textarea property="text" />
      </fieldset>
    </ly-form-model>
  </ly-modal>
</template>

<style scoped></style>
