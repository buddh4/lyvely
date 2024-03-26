import { ChartSeriesConfigModel, ChartCategory, ChartType } from '@lyvely/analytics-interface';
import { getChartDefinitions } from '@/registries';
import { ISelectOptions, resolveComponentRegistration } from '@lyvely/ui';
import { createBaseModelAndInit } from '@lyvely/common';
import { computed } from 'vue';

export const useChartTemplates = (templateId?: string) => {
  const templateChartDefinition = getChartDefinitions().find((definition) =>
    definition.templates?.find((t) => t.id === templateId),
  );

  const templateDefinition = templateChartDefinition?.templates?.find((t) => t.id === templateId);

  const templateFormComponent = templateChartDefinition?.form
    ? resolveComponentRegistration(templateChartDefinition.form)
    : null;

  const templateOptions = getChartDefinitions().reduce(
    (options, definition) => {
      definition.templates?.forEach(({ id, label }) => options.push({ value: id, label }));
      return options;
    },
    [{ value: '', label: 'analytics.templates.none' }] as ISelectOptions,
  );

  let templateModel: ChartSeriesConfigModel | undefined = undefined;

  if (!templateDefinition) {
    templateModel = undefined;
  } else if (templateDefinition?.initModel) {
    templateModel = templateDefinition.initModel();
    templateModel.templateId = templateDefinition.id;
  } else if (templateChartDefinition?.type?.configType) {
    templateModel = createBaseModelAndInit(templateChartDefinition.type.configType, {
      templateId: templateDefinition.id,
    });
  }

  const allowedChartTypes =
    templateDefinition?.chartTypes || templateChartDefinition?.type.chartTypes || [];

  const chartTypeOptions = computed(() => {
    const result: ISelectOptions = [];

    if (allowedChartTypes.includes(ChartType.Bar))
      result.push({ value: ChartType.Bar, label: `analytics.types.bar` });
    if (allowedChartTypes.includes(ChartType.Line))
      result.push({ value: ChartType.Line, label: `analytics.types.line` });
    if (allowedChartTypes.includes(ChartType.Pie))
      result.push({ value: ChartType.Pie, label: `analytics.types.pie` });
    if (allowedChartTypes.includes(ChartType.Calendar))
      result.push({ value: ChartType.Calendar, label: `analytics.types.calendar` });

    return result;
  });

  return {
    allowedChartTypes,
    chartTypeOptions,
    templateModel,
    templateChartDefinition,
    templateDefinition,
    templateFormComponent,
    templateOptions,
  };
};
