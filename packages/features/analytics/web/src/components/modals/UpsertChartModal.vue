<script lang="ts" setup>
import { computed } from 'vue';
import {
  TagPicker,
  ContentEditModalEmits,
  useContentUpsertModal,
  ICreateContentInitOptions,
} from '@lyvely/web';
import { LyModal, LyFormModel, LyTextField, LyTextarea, isTouchScreen } from '@lyvely/ui';
import {
  ChartModel,
  CreateChartModel,
  UpdateChartModel,
  useChartsClient,
} from '@lyvely/analytics-interface';
import ChartSeriesForm from '@/components/forms/ChartSeriesForm.vue';

export interface IProps {
  modelValue: boolean;
  content?: ChartModel;
  type: string;
  initOptions?: ICreateContentInitOptions;
}

const props = defineProps<IProps>();
const emit = defineEmits(ContentEditModalEmits);

const { isCreate, showModal, model, validator, submit, status } = useContentUpsertModal<
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
      :show-alert="false"
      class="mb-2"
      label-key="common.fields">
      <fieldset>
        <ly-text-field
          property="title"
          :required="true"
          :autofocus="isCreate || !isTouchScreen()"
          :auto-validation="false" />
      </fieldset>
    </ly-form-model>

    <chart-series-form v-if="isCreate" v-model="model" :embedded="true" />

    <ly-form-model
      v-model="model"
      :validator="validator"
      :status="status"
      label-key="common.fields">
      <fieldset>
        <tag-picker v-model="model.tagNames" option-key="name" />
        <ly-textarea property="text" />
      </fieldset>
    </ly-form-model>
  </ly-modal>
</template>

<style scoped></style>
