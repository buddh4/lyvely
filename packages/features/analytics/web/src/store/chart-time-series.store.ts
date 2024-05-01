import { reactive, ref } from 'vue';
import {
  ChartModel,
  useChartsClient,
  UpdateChartSeriesModel,
  UpdateChartModel,
  TIME_SERIES_CHART,
} from '@lyvely/analytics-interface';
import { I18nModelValidator, IntegrityException, loadingStatus, useStatus } from '@lyvely/web';
import { useChartsStore } from '@/store/charts.store';
import { CreateChartSeriesModel } from '@lyvely/analytics-interface/src';

const model = ref(new UpdateChartModel({}));
const showModal = ref(false);
const chart = ref<ChartModel>();
const status = useStatus();
const isCreate = ref(false);
const sid = ref('');
const validator = reactive(new I18nModelValidator<UpdateChartModel>());

export const useUpsertChartTimeSeriesStore = () => {
  const client = useChartsClient();

  function reset() {
    model.value = new UpdateChartModel({ category: TIME_SERIES_CHART.id });
    validator.setModel(model.value);
    chart.value = undefined;
    showModal.value = false;
    sid.value = '';
    status.resetStatus();
  }

  function addSeries(chartModel: ChartModel) {
    isCreate.value = true;
    model.value = new UpdateChartModel({ category: chartModel.config.category });
    validator.setModel(model.value);
    chart.value = chartModel;
    showModal.value = true;
  }

  function updateSeries(model: ChartModel, seriesId: string) {
    const series = model.config.series.find((s) => s.id === seriesId);

    if (!series) {
      console.error('Attempt to update non existing series');
      return;
    }

    isCreate.value = false;
    chart.value = model;
    sid.value = seriesId;
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

  async function _create(): Promise<ChartModel> {
    if (!chart.value) throw new IntegrityException('No chart model selected!');
    if (!model.value.series) throw new IntegrityException('No series selected!');

    const newChart = await loadingStatus(
      () => client.addSeries(chart.value!.id, new CreateChartSeriesModel(model.value.series!)),
      status,
    );

    useChartsStore().updateOrPushChart(newChart);
    return newChart;
  }

  async function _update() {
    if (!chart.value || !sid.value) throw new IntegrityException('No chart model or sid selected!');

    const update = await loadingStatus(
      () =>
        client.updateSeries(chart.value!.id, sid.value, new UpdateChartSeriesModel(model.value)),
      status,
    );
    useChartsStore().updateOrPushChart(update);
    return update;
  }

  return {
    chart,
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
