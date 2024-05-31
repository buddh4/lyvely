<script lang="ts" setup>
import {
  DataPointInputType,
  DataPointValueType,
  INumberDataPointConfig,
  ITimerDataPointConfig,
} from '@lyvely/time-series-interface';
import { LyButton, LyNumberField, LyTimeNumberInput, LyIcon } from '@lyvely/ui';
import { t } from '@lyvely/web';

interface IProps {
  modelValue: Partial<
    Omit<INumberDataPointConfig | ITimerDataPointConfig, 'history' | 'valueType'>
  > & { valueType?: string };
  score?: boolean;
  timer?: boolean;
  isCreate: boolean;
}

defineEmits(['update:modelValue']);

const props = withDefaults(defineProps<IProps>(), {
  score: false,
  timer: false,
  isCreate: false,
});

const showInputTypeSelection =
  props.isCreate || props.modelValue.valueType !== DataPointValueType.Timer;

const showTimerInputOption =
  props.timer && (props.isCreate || props.modelValue.valueType === DataPointValueType.Timer);

function setInputType(inputType: DataPointInputType) {
  const modelValue = props.modelValue;
  modelValue.inputType = inputType;
  modelValue.valueType =
    inputType === DataPointInputType.Timer ? DataPointValueType.Timer : DataPointValueType.Number;

  if (modelValue.inputType === DataPointInputType.Checkbox && modelValue.max! > 8) {
    modelValue.max = 8;
  }
}
</script>

<template>
  <div class="flex flex-col gap-2 rounded border border-divide bg-highlight p-3 dark:bg-main">
    <div v-if="showInputTypeSelection" class="flex items-stretch justify-between gap-2">
      <ly-button
        class="secondary outlined w-full text-xs"
        :active="modelValue.inputType === DataPointInputType.Checkbox"
        @click="setInputType(DataPointInputType.Checkbox)">
        {{ t('time-series.input_types.checkbox') }}
      </ly-button>

      <ly-button
        class="secondary outlined w-full text-xs"
        :active="modelValue.inputType === DataPointInputType.Spinner"
        @click="setInputType(DataPointInputType.Spinner)">
        {{ t('time-series.input_types.spinner') }}
      </ly-button>

      <ly-button
        class="secondary outlined w-full text-xs"
        :active="modelValue.inputType === DataPointInputType.Range"
        @click="setInputType(DataPointInputType.Range)">
        {{ t('time-series.input_types.range') }}
      </ly-button>

      <ly-button
        v-if="showTimerInputOption"
        class="secondary outlined w-full text-xs"
        :active="modelValue.inputType === DataPointInputType.Timer"
        @click="setInputType(DataPointInputType.Timer)">
        {{ t('time-series.input_types.timer') }}
      </ly-button>
    </div>

    <div class="grid grid-cols-2 grid-rows-2 gap-2">

      <div>
        <ly-time-number-input
            v-if="modelValue.inputType === DataPointInputType.Timer"
            property="min"
            label="time-series.fields.min"
            :max="modelValue.max" />
        <ly-number-field
            v-else
            property="min"
            label="time-series.fields.min"
            :min="0"
            :max="modelValue.max" />
      </div>

      <div>
        <ly-time-number-input
            v-if="modelValue.inputType === DataPointInputType.Timer"
            property="optimal"
            label="time-series.fields.optimal"
            :min="modelValue.min"
            :max="modelValue.max" />
        <ly-number-field
            v-else
            property="optimal"
            label="time-series.fields.optimal"
            :min="modelValue.min"
            :max="modelValue.max" />
      </div>

      <div>
        <ly-number-field
          v-if="modelValue.inputType === DataPointInputType.Checkbox"
          property="max"
          label="time-series.fields.max"
          :min="1"
          :max="8" />
        <ly-time-number-input
          v-else-if="modelValue.inputType === DataPointInputType.Timer"
          property="max"
          label="time-series.fields.max" />
        <ly-number-field v-else property="max" label="time-series.fields.max" :min="1" />
      </div>

      <div v-if="score" class="flex flex-col">
        <ly-number-field
          property="score"
          label="time-series.fields.score"
          :mb="0"
          :steps="2"
          :max="100"
          :min="-100" />
        <div
          v-if="modelValue.inputType === DataPointInputType.Timer"
          class="flex h-full gap-2 rounded border border-divide bg-highlight p-2 text-xs text-dimmed">
          <div>
            <ly-icon name="info" class="text-info-light" />
          </div>
          <div>
            {{ t('time-series.timer_score_info') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
