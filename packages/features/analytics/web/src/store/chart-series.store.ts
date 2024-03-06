import { reactive, ref, watch } from 'vue';
import {
  CHART_SERIES_TYPE_SCORE,
  ChartModel,
  ChartType,
  useChartsClient,
} from '@lyvely/analytics-interface';
import { I18nModelValidator, loadingStatus, useStatus } from '@lyvely/web';
import { getChartSeriesFormDefinition } from '@/registries';
import { ComponentRegistration } from '@lyvely/ui';
import { UpdateChartSeriesModel } from '@/models';
import { useChartsStore } from '@/store/charts.store';
import { ChartSeriesConfigModel } from '@lyvely/analytics-interface/src';

const showModal = ref(false);
const status = useStatus();
const isCreate = ref(false);
const cid = ref('');
const sid = ref('');
const model = ref(new ChartSeriesConfigModel<undefined>());
const validator = reactive(new I18nModelValidator<ChartSeriesConfigModel<undefined>>());
const formComponent = ref<ComponentRegistration>();

export const useEditChartSeriesStore = () => {
  const client = useChartsClient();

  watch(model, (newValue, oldValue) => {
    if (newValue.type !== oldValue.type) setType(newValue.type);
  });

  function reset() {
    model.value = new ChartSeriesConfigModel<undefined>();
    validator.setModel(model.value);
    formComponent.value = undefined;
    showModal.value = false;
    cid.value = '';
    sid.value = '';
    status.resetStatus();
  }

  function addSeries(chartId: string, chartType: ChartType) {
    setType(_getDefaultSeriesType(chartType));
    isCreate.value = true;
    cid.value = chartId;
  }

  function updateSeries(chart: ChartModel, seriesId: string) {
    const series = chart.config.series.find((s) => s.id === seriesId);

    if (!series) {
      console.error('Attempt to update non existing series');
      return;
    }

    setType(series.type);
    isCreate.value = false;
    cid.value = chart.id;
    sid.value = seriesId;
  }

  function _getDefaultSeriesType(chartType: ChartType) {
    switch (chartType) {
      case ChartType.Graph:
        return CHART_SERIES_TYPE_SCORE;
    }
    return CHART_SERIES_TYPE_SCORE;
  }

  function setType(type: string, formData?: any) {
    const definition = getChartSeriesFormDefinition(type);
    if (!definition) {
      console.error('Could not find graph type definition for ' + type);
      return;
    }

    if (definition.type.configType) {
      const FormModel = definition.type.configType;
      model.value = new FormModel({ type, ...formData });
      validator.setModel(model.value!);
    }

    if (definition.form) {
      formComponent.value = definition.form;
    }

    showModal.value = true;
  }

  async function submit() {
    if (!(await validator.validate())) return false;
    try {
      if (isCreate.value) await _create();
      else await _update();

      reset();
    } catch (e) {
      return false;
    }
  }

  async function _create() {
    const chart = await loadingStatus(
      () => client.addSeries(cid.value, new UpdateChartSeriesModel(model.value)),
      status,
    );
    useChartsStore().updateOrPushChart(chart);
    return chart;
  }

  async function _update() {
    const chart = await loadingStatus(
      () => client.updateSeries(cid.value, sid.value, new UpdateChartSeriesModel(model.value)),
      status,
    );
    useChartsStore().updateOrPushChart(chart);
    return chart;
  }

  return {
    model,
    validator,
    showModal,
    isCreate,
    submit,
    reset,
    addSeries,
    updateSeries,
  };
};
