<script setup lang="ts">
import {
  ChartCategory,
  ChartType,
  type CreateChartModel,
  type UpdateChartModel,
} from '@lyvely/analytics-interface';
import { t } from '@lyvely/web';
import { LyAlert, LySelect, LyButton, useModel } from '@lyvely/ui';
import { useChartTemplates } from '@/composables';

const props = withDefaults(
  defineProps<{
    modelValue: CreateChartModel | UpdateChartModel;
    embedded?: boolean;
  }>(),
  {
    embedded: false,
  },
);

const emit = defineEmits(['update:modelValue']);

const { formValue } = useModel(props.modelValue, emit);

const {
  chartTypeOptions,
  allowedChartTypes,
  templateOptions,
  templateDefinition,
  templateFormComponent,
  templateModel,
} = useChartTemplates(formValue.value.templateId);
</script>

<template>
  <fieldset>
    <div
      :class="{
        'flex flex-col gap-2 border border-divide rounded bg-highlight dark:bg-main p-3': embedded,
      }">
      <ly-select
        v-model="formValue.templateId"
        class="shadow-lg"
        label="analytics.fields.template"
        :options="templateOptions" />

      <ly-alert
        v-if="templateDefinition?.description"
        type="secondary"
        :text="templateDefinition.description"
        text-size="xs" />

      <div
        v-if="chartTypeOptions.length > 1 && templateModel"
        class="flex gap-2 justify-between items-stretch">
        <ly-button
          v-if="allowedChartTypes.includes(ChartType.Line)"
          class="text-xs secondary w-full outlined"
          :active="templateModel.chartType === ChartType.Line"
          @click="templateModel.chartType = ChartType.Line">
          {{ t('analytics.charts.types.line') }}
        </ly-button>

        <ly-button
          v-if="allowedChartTypes.includes(ChartType.Bar)"
          class="text-xs secondary w-full outlined"
          :active="templateModel.chartType === ChartType.Bar"
          @click="templateModel.chartType = ChartType.Bar">
          {{ t('analytics.charts.types.bar') }}
        </ly-button>

        <ly-button
          v-if="allowedChartTypes.includes(ChartType.Pie)"
          class="text-xs secondary w-full outlined"
          :active="templateModel.chartType === ChartType.Pie"
          @click="templateModel.chartType = ChartType.Pie">
          {{ t('analytics.charts.types.pie') }}
        </ly-button>

        <ly-button
          v-if="allowedChartTypes.includes(ChartType.Calendar)"
          class="text-xs secondary w-full outlined"
          :active="templateModel.chartType === ChartType.Calendar"
          @click="templateModel.chartType = ChartType.Calendar">
          {{ t('analytics.charts.types.calendar') }}
        </ly-button>
      </div>

      <component
        :is="templateFormComponent"
        v-if="templateFormComponent && templateModel"
        v-model="templateModel" />
    </div>
  </fieldset>
</template>

<style scoped></style>
