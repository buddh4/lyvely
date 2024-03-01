import { reactive, ref, watch } from 'vue';
import { GRAPH_TYPE_SCORE, useChartsClient } from '@lyvely/analytics-interface';
import { I18nModelValidator, loadingStatus, useStatus } from '@lyvely/web';
import { getGraphTypeDefinition } from '@/registries';
import { ComponentRegistration } from '@lyvely/ui';
import { BaseModel } from '@lyvely/common';
import { UpdateChartSeriesModel } from '@/models';
import { useChartsStore } from '@/store/charts.store';

const showModal = ref(false);
const status = useStatus();
const isCreate = ref(false);
const cid = ref('');
const sid = ref('');
const baseModel = ref<UpdateChartSeriesModel>(
  new UpdateChartSeriesModel({ type: GRAPH_TYPE_SCORE }),
);
const baseValidator = reactive(
  new I18nModelValidator<UpdateChartSeriesModel>(baseModel.value),
) as I18nModelValidator<UpdateChartSeriesModel>;
const formModel = ref<BaseModel<any>>();
const formValidator = reactive(new I18nModelValidator<BaseModel<any>>());
const formComponent = ref<ComponentRegistration>();

export const useEditGraphSeriesStore = () => {
  const client = useChartsClient();

  watch(baseModel, (newValue, oldValue) => {
    if (newValue.type !== oldValue.type) setType(newValue.type);
  });

  function reset() {
    baseModel.value = new UpdateChartSeriesModel({ type: GRAPH_TYPE_SCORE });
    baseValidator.setModel(baseModel.value);
    formModel.value = undefined;
    formComponent.value = undefined;
    showModal.value = false;
    cid.value = '';
    sid.value = '';
    status.resetStatus();
  }

  function createSeries(chartId: string) {
    setType(GRAPH_TYPE_SCORE);
    isCreate.value = true;
    cid.value = chartId;
  }

  function updateSeries(chartId: string, seriesId: string) {
    setType(GRAPH_TYPE_SCORE);
    isCreate.value = false;
    cid.value = chartId;
    sid.value = seriesId;
  }

  function setType(type: string, formData?: any) {
    const definition = getGraphTypeDefinition(type);
    if (!definition) {
      console.error('Could not find graph type definition for ' + type);
      return;
    }

    if (definition.model) {
      const FormModel = definition.model;
      formModel.value = new FormModel(formData);
      formValidator.setModel(formModel.value!);
    }

    if (definition.form) {
      formComponent.value = definition.form;
    }

    showModal.value = true;
  }

  async function submit() {
    if (!(await baseValidator.validate())) return false;
    if (formModel.value && !(await formValidator.validate())) return false;
    if (isCreate.value) {
      const chart = await loadingStatus(
        () =>
          client.addSeries(
            cid.value,
            new UpdateChartSeriesModel({ ...baseModel.value, config: formModel.value }),
          ),
        status,
      );
      useChartsStore().updateOrPushChart(chart);
      reset();
    } else {
      const chart = await loadingStatus(
        () =>
          client.updateSeries(
            cid.value,
            sid.value,
            new UpdateChartSeriesModel({ ...baseModel.value, config: formModel.value }),
          ),
        status,
      );
      useChartsStore().updateOrPushChart(chart);
      reset();
    }
  }

  return {
    baseModel,
    baseValidator,
    formModel,
    formValidator,
    showModal,
    isCreate,
    submit,
    reset,
    createSeries,
  };
};
