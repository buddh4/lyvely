<script lang="ts" setup>
import {
  CreateHabitModel,
  HabitModel,
  UpdateHabitModel,
  useHabitsClient,
} from '@lyvely/habits-interface';
import { NumberDataPointConfigForm, useDataPointStrategyFacade } from '@lyvely/time-series-web';
import { computed } from 'vue';
import {
  TagPicker,
  ContentEditModalEmits,
  useContentEditModal,
  ICreateContentInitOptions,
} from '@lyvely/web';
import { getCalendarPlanOptions } from '@lyvely/calendar-plan-web';
import { LyModal, LyFormModel, LyTextField, LySelect, LyTextarea, isTouchScreen } from '@lyvely/ui';

export interface IProps {
  modelValue: boolean;
  content?: HabitModel;
  type: string;
  initOptions?: ICreateContentInitOptions;
}

const props = defineProps<IProps>();
const emit = defineEmits(ContentEditModalEmits);

const { isCreate, showModal, model, validator, submit, status } = useContentEditModal<
  HabitModel,
  CreateHabitModel,
  UpdateHabitModel
>(props, emit, {
  client: useHabitsClient(),
});

function adjustAndSubmit() {
  useDataPointStrategyFacade().prepareConfig(<any>model.value);
  submit();
}

const calendarPlanOptions = computed(() => getCalendarPlanOptions());

const modalTitle = computed(() => {
  return isCreate.value ? `habits.create.title` : `habits.edit.title`;
});
</script>

<template>
  <ly-modal
    v-model="showModal"
    :title="modalTitle"
    @submit="adjustAndSubmit"
    @cancel="$emit('cancel')">
    <template #preHeader><slot name="navigation"></slot></template>
    <ly-form-model
      id="habit-form"
      v-model="model"
      :validator="validator"
      :status="status"
      label-key="common.fields">
      <fieldset>
        <ly-text-field
          property="title"
          :required="true"
          :autofocus="isCreate || !isTouchScreen()"
          :auto-validation="false" />
        <ly-select
          property="interval"
          type="number"
          :required="true"
          :options="calendarPlanOptions" />
      </fieldset>

      <fieldset>
        <number-data-point-config-form
          v-model="model"
          :is-create="isCreate"
          :timer="true"
          :score="true" />
      </fieldset>

      <fieldset>
        <tag-picker v-model="model.tagNames" />
        <ly-textarea property="text" />
      </fieldset>
    </ly-form-model>
  </ly-modal>
</template>

<style scoped></style>
