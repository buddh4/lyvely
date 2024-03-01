<script lang="ts" setup>
import { computed } from 'vue';
import {
  TagChooser,
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
  ISelectOptions,
  LyButton,
} from '@lyvely/ui';
import {
  ChartModel,
  ChartType,
  CreateChartModel,
  UpdateChartModel,
  useChartsClient,
} from '@lyvely/analytics-interface';
import { CalendarInterval } from '@lyvely/dates';

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

const intervalOptions: ISelectOptions = [
  { value: `${CalendarInterval.Daily}`, label: `analytics.interval.5` },
  { value: `${CalendarInterval.Weekly}`, label: `analytics.interval.4` },
  { value: `${CalendarInterval.Monthly}`, label: `analytics.interval.3` },
  { value: `${CalendarInterval.Quarterly}`, label: `analytics.interval.2` },
  { value: `${CalendarInterval.Yearly}`, label: `analytics.interval.1` },
];

const modalTitle = computed(() => {
  return isCreate.value ? `analytics.charts.create.title` : `analytics.charts.edit.title`;
});

function isCreateModel(m: UpdateChartModel | CreateChartModel): m is CreateChartModel {
  return isCreate.value;
}

const chartType = computed(() => {
  const modelValue = model.value;
  return isCreateModel(modelValue) ? modelValue.type : props.content?.config.type;
});

function setChartType(chartType: ChartType) {
  const modelValue = model.value;
  if (!isCreateModel(modelValue)) return;
  modelValue.type = chartType;
}
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
        <ly-select
          property="interval"
          type="number"
          label="analytics.fields.interval"
          :required="true"
          :options="intervalOptions" />

        <div class="flex gap-2 justify-between items-stretch">
          <ly-button
            class="text-xs secondary w-full outlined"
            :active="chartType === ChartType.Graph"
            @click="setChartType(ChartType.Graph)">
            {{ t('analytics.charts.types.graph') }}
          </ly-button>

          <ly-button
            class="text-xs secondary w-full outlined"
            :active="chartType === ChartType.Pie"
            @click="setChartType(ChartType.Pie)">
            {{ t('analytics.charts.types.pie') }}
          </ly-button>

          <ly-button
            class="text-xs secondary w-full outlined"
            :active="chartType === ChartType.Calendar"
            @click="setChartType(ChartType.Calendar)">
            {{ t('analytics.charts.types.calendar') }}
          </ly-button>
        </div>
      </fieldset>

      <fieldset>
        <tag-chooser v-model="model.tagNames" />
        <ly-textarea property="text" />
      </fieldset>
    </ly-form-model>
  </ly-modal>
</template>

<style scoped></style>
