<script setup lang="ts">
import { I18nModelValidator, type IContentPickerProvider, ContentPicker } from '@lyvely/web';
import { LyFormModel, useModel, LyColorPicker, type Translatable } from '@lyvely/ui';
import { computed } from 'vue';
import { TimeSeriesChartTypeSelection } from '@lyvely/analytics-web';
import { TimeSeriesValueChartConfigModel } from '@lyvely/time-series-interface';
import type { IContentSearchQuery } from '@lyvely/interface';

const props = defineProps<{
  modelValue: TimeSeriesValueChartConfigModel<string>;
  pickerTitle?: Translatable;
  filter?: IContentSearchQuery;
  provider: IContentPickerProvider;
}>();

const emit = defineEmits(['update:modelValue']);

const { formValue } = useModel(props.modelValue!, emit);

const cid = computed({
  get: () => (formValue.value.cid ? [formValue.value.cid] : []),
  set: (value: string[]) => {
    formValue.value.cid = value[0];
  },
});

const validator = computed(() => new I18nModelValidator(formValue.value));
</script>

<template>
  <div>
    <ly-form-model v-model="formValue" :validator="validator">
      <content-picker
        v-model="cid"
        :filter="filter"
        :title="pickerTitle"
        :provider="provider"
        :max="1" />
      <ly-color-picker v-model="formValue.color" label="common.fields.color" />
      <time-series-chart-type-selection v-model="formValue.chartType" />
    </ly-form-model>
  </div>
</template>

<style scoped></style>
