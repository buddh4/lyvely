<script setup lang="ts">
import {
  ChartType,
  type CreateChartModel,
  type UpdateChartModel,
} from '@lyvely/analytics-interface';
import { t } from '@lyvely/web';
import { LyAlert, LySelect, LyButton, LyTextField, useModel, LyFormModel } from '@lyvely/ui';
import { useChartTemplates } from '@/composables';
import { ref } from 'vue';

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

const seriesTypeId = ref('');

const {
  seriesTypeDefinition,
  allowedChartTypes,
  chartTypeOptions,
  seriesConfigModel,
  seriesFormComponent,
  seriesTypeOptions,
  validator,
} = useChartTemplates(formValue, seriesTypeId);
</script>

<template>
  <fieldset>
    <div
      :class="{
        'flex flex-col gap-2 border border-divide rounded bg-highlight dark:bg-main p-3': embedded,
      }">
      <ly-select
        v-model="seriesTypeId"
        class="shadow-lg"
        label="analytics.fields.type"
        :options="seriesTypeOptions" />

      <ly-alert
        v-if="seriesTypeDefinition?.description"
        type="secondary"
        :text="seriesTypeDefinition!.description"
        text-size="xs" />

      <ly-form-model v-if="seriesConfigModel" v-model="seriesConfigModel" :validator="validator">
        <ly-text-field
          property="name"
          label="common.fields.label"
          :error="validator.getError('name')" />
      </ly-form-model>

      <div
        v-if="chartTypeOptions.length > 1 && seriesConfigModel"
        class="flex gap-2 justify-between items-stretch">
        <ly-button
          v-if="allowedChartTypes.includes(ChartType.Line)"
          class="text-xs secondary w-full outlined"
          :active="seriesConfigModel.chartType === ChartType.Line"
          @click="seriesConfigModel.chartType = ChartType.Line">
          {{ t('analytics.charts.types.line') }}
        </ly-button>

        <ly-button
          v-if="allowedChartTypes.includes(ChartType.Bar)"
          class="text-xs secondary w-full outlined"
          :active="seriesConfigModel.chartType === ChartType.Bar"
          @click="seriesConfigModel.chartType = ChartType.Bar">
          {{ t('analytics.charts.types.bar') }}
        </ly-button>

        <ly-button
          v-if="allowedChartTypes.includes(ChartType.Pie)"
          class="text-xs secondary w-full outlined"
          :active="seriesConfigModel.chartType === ChartType.Pie"
          @click="seriesConfigModel.chartType = ChartType.Pie">
          {{ t('analytics.charts.types.pie') }}
        </ly-button>
      </div>

      <component
        :is="seriesFormComponent"
        v-if="seriesFormComponent && seriesConfigModel"
        v-model="seriesConfigModel" />
    </div>
  </fieldset>
</template>

<style scoped></style>
