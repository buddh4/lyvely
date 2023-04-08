<script lang="ts" setup>
import {
  DataPointInputType,
  DataPointValueType,
  INumberDataPointConfig,
  ITimerDataPointConfig,
} from '@lyvely/common';

interface IProps {
  modelValue: INumberDataPointConfig | ITimerDataPointConfig;
  score: boolean;
  timer: boolean;
  isCreate: boolean;
}

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
  <div class="flex flex-col gap-2 border border-divide rounded bg-highlight dark:bg-main p-3">
    <div v-if="showInputTypeSelection" class="flex gap-2 justify-between items-stretch">
      <ly-button
        class="text-xs secondary w-full"
        :active="modelValue.inputType === DataPointInputType.Checkbox"
        @click="setInputType(DataPointInputType.Checkbox)">
        {{ $t('calendar.plan.input_types.checkbox') }}
      </ly-button>

      <ly-button
        class="text-xs secondary w-full"
        :active="modelValue.inputType === DataPointInputType.Spinner"
        @click="setInputType(DataPointInputType.Spinner)">
        {{ $t('calendar.plan.input_types.spinner') }}
      </ly-button>

      <ly-button
        class="text-xs secondary w-full"
        :active="modelValue.inputType === DataPointInputType.Range"
        @click="setInputType(DataPointInputType.Range)">
        {{ $t('calendar.plan.input_types.range') }}
      </ly-button>

      <ly-button
        v-if="showTimerInputOption"
        class="text-xs secondary w-full"
        :active="modelValue.inputType === DataPointInputType.Timer"
        @click="setInputType(DataPointInputType.Timer)">
        {{ $t('calendar.plan.input_types.timer') }}
      </ly-button>
    </div>

    <div class="grid grid-flow-col grid-cols-2 grid-rows-2 gap-2">
      <div>
        <ly-input-number
          v-if="modelValue.inputType === DataPointInputType.Checkbox"
          property="max"
          label="calendar.plan.fields.max"
          :min="1"
          :max="8" />
        <ly-input-time-number
          v-else-if="modelValue.inputType === DataPointInputType.Timer"
          property="max"
          label="calendar.plan.fields.max" />
        <ly-input-number v-else property="max" label="calendar.plan.fields.max" :min="1" />
      </div>

      <div>
        <ly-input-time-number
          v-if="modelValue.inputType === DataPointInputType.Timer"
          property="min"
          label="calendar.plan.fields.min"
          :max="modelValue.max" />
        <ly-input-number
          v-else
          property="min"
          label="calendar.plan.fields.min"
          :min="0"
          :max="modelValue.max" />
      </div>
      <div>
        <ly-input-time-number
          v-if="modelValue.inputType === DataPointInputType.Timer"
          property="optimal"
          label="calendar.plan.fields.optimal"
          :min="modelValue.min"
          :max="modelValue.max" />
        <ly-input-number
          v-else
          property="optimal"
          label="calendar.plan.fields.optimal"
          :min="modelValue.min"
          :max="modelValue.max" />
      </div>
      <div v-if="score" class="flex flex-col">
        <ly-input-number
          property="score"
          label="calendar.plan.fields.score"
          :mb="0"
          :steps="2"
          :max="100"
          :min="-100" />
        <div
          v-if="modelValue.inputType === DataPointInputType.Timer"
          class="flex border border-divide bg-highlight rounded h-full p-2 text-xs text-dimmed gap-2">
          <div>
            <ly-icon name="info" class="text-info-light" />
          </div>
          <div>
            {{ $t('calendar.plan.timer_score_info') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
