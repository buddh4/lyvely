import {
  ChartSeriesConfigModel,
  ChartType,
  CreateChartModel,
  UpdateChartModel,
} from '@lyvely/analytics-interface';
import { getChartDefinition, getChartDefinitions } from '@/registries';
import { ISelectOptions, resolveComponentRegistration } from '@lyvely/ui';
import { createBaseModelAndInit } from '@lyvely/common';
import { computed, reactive, ref, Ref, watch } from 'vue';
import { isFunction } from 'lodash';
import { I18nModelValidator } from '@lyvely/web';

export const useChartTemplates = (
  formValue: Ref<CreateChartModel | UpdateChartModel>,
  seriesTypeId: Ref<string>,
) => {
  const seriesTypeDefinition = computed(() => getChartDefinition(seriesTypeId.value));

  const seriesFormComponent = computed(() =>
    seriesTypeDefinition.value?.form
      ? resolveComponentRegistration(seriesTypeDefinition.value?.form)
      : null,
  );

  const seriesTypeOptions = computed(() =>
    getChartDefinitions().reduce(
      (options, definition) => {
        if (!isFunction(definition.condition) || definition.condition()) {
          options.push({ value: definition.type.id, label: definition.label });
        }
        return options;
      },
      [{ value: '', label: 'analytics.templates.none' }] as ISelectOptions,
    ),
  );

  const seriesConfigModel = ref<ChartSeriesConfigModel>();
  const validator = reactive(
    new I18nModelValidator<ChartSeriesConfigModel>(),
  ) as I18nModelValidator<ChartSeriesConfigModel>;

  watch(
    seriesTypeId,
    () => {
      if (!seriesTypeDefinition.value) {
        seriesConfigModel.value = undefined;
      } else if (seriesTypeDefinition.value?.initModel) {
        seriesConfigModel.value = seriesTypeDefinition.value.initModel();
      } else if (seriesTypeDefinition.value?.type?.configType) {
        seriesConfigModel.value = createBaseModelAndInit(
          seriesTypeDefinition.value.type.configType,
          {},
        );
        seriesConfigModel.value!.type ??= seriesTypeDefinition.value?.type.id;
      } else {
        seriesConfigModel.value = new ChartSeriesConfigModel({
          type: seriesTypeDefinition.value!.type.id,
        });
      }

      formValue.value!.series = seriesConfigModel.value;
    },
    { immediate: true },
  );

  const allowedChartTypes = computed(() => seriesTypeDefinition.value?.type.chartTypes || []);

  const chartTypeOptions = computed(() => {
    const result: ISelectOptions = [];

    if (allowedChartTypes.value.includes(ChartType.Bar))
      result.push({ value: ChartType.Bar, label: `analytics.types.bar` });
    if (allowedChartTypes.value.includes(ChartType.Line))
      result.push({ value: ChartType.Line, label: `analytics.types.line` });
    if (allowedChartTypes.value.includes(ChartType.Pie))
      result.push({ value: ChartType.Pie, label: `analytics.types.pie` });

    return result;
  });

  watch(seriesConfigModel, (newValue) => {
    formValue!.value.series = newValue;
    if (newValue) {
      validator.setModel(newValue);
    } else {
      validator.reset();
    }
  });

  return {
    seriesTypeDefinition,
    allowedChartTypes,
    chartTypeOptions,
    seriesConfigModel,
    seriesFormComponent,
    seriesTypeOptions,
    validator,
  };
};
