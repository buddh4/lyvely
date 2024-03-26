<script lang="ts" setup>
import {
  CreateJournalModel,
  JournalModel,
  UpdateJournalModel,
  useJournalsClient,
} from '@lyvely/journals-interface';
import {
  DataPointInputType,
  DataPointValueType,
  NumberDataPointConfigForm,
  TextDataPointConfigForm,
  SelectionDataPointConfigForm,
} from '@lyvely/time-series-web';
import { computed } from 'vue';
import {
  TagPicker,
  ContentEditModalEmits,
  ICreateContentInitOptions,
  useContentEditModal,
  t,
} from '@lyvely/web';
import {
  isTouchScreen,
  LyModal,
  LyFormModel,
  LyTextField,
  LySelect,
  LyButton,
  LyTextarea,
} from '@lyvely/ui';
import { getCalendarPlanOptions } from '@lyvely/calendar-plan-web';

export interface IProps {
  modelValue: boolean;
  content?: JournalModel;
  type: string;
  initOptions?: ICreateContentInitOptions;
}

const props = defineProps<IProps>();
const emit = defineEmits(ContentEditModalEmits);

const { isCreate, showModal, model, validator, submit, status } = useContentEditModal<
  JournalModel,
  CreateJournalModel,
  UpdateJournalModel
>(props, emit, {
  client: useJournalsClient(),
});

function setValueType(valueType: CreateJournalModel['valueType']) {
  if (!model.value) return;
  model.value.valueType = valueType;
  // TODO: Move this somewhere else...
  if (valueType === DataPointValueType.Number) {
    model.value.inputType = DataPointInputType.Checkbox;
  } else if (valueType === DataPointValueType.Text) {
    model.value.inputType = DataPointInputType.Textarea;
  } else if (valueType === DataPointValueType.Selection) {
    model.value.inputType = DataPointInputType.Checkbox;
  }
}

const calendarPlanOptions = computed(() => getCalendarPlanOptions());

const modalTitle = computed(() => {
  return isCreate.value ? `journals.create.title` : `journals.edit.title`;
});
</script>

<template>
  <ly-modal v-model="showModal" :title="modalTitle" @submit="submit" @cancel="$emit('cancel')">
    <template #preHeader><slot name="navigation"></slot></template>
    <ly-form-model
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
        <ly-select property="interval" :required="true" :options="calendarPlanOptions" />
      </fieldset>

      <fieldset>
        <div class="flex flex-col gap-2">
          <div class="flex gap-2 justify-between items-stretch">
            <ly-button
              class="text-xs secondary w-full outlined"
              :active="model.valueType === DataPointValueType.Number"
              @click="setValueType(DataPointValueType.Number)">
              {{ t('calendar-plan.value_types.number') }}
            </ly-button>

            <ly-button
              class="text-xs secondary w-full outlined"
              :active="model.valueType === DataPointValueType.Text"
              @click="setValueType(DataPointValueType.Text)">
              {{ t('calendar-plan.value_types.text') }}
            </ly-button>

            <ly-button
              class="text-xs secondary w-full outlined"
              :active="model.valueType === DataPointValueType.Selection"
              @click="setValueType(DataPointValueType.Selection)">
              {{ t('calendar-plan.value_types.selection') }}
            </ly-button>
          </div>

          <number-data-point-config-form
            v-if="model.valueType === DataPointValueType.Number"
            v-model="model"
            :is-create="isCreate" />
          <text-data-point-config-form
            v-else-if="model.valueType === DataPointValueType.Text"
            v-model="model" />
          <selection-data-point-config-form
            v-else-if="model.valueType === DataPointValueType.Selection"
            v-model="model" />
        </div>
      </fieldset>

      <fieldset>
        <tag-picker v-model="model.tagNames" />
        <ly-textarea property="text" />
      </fieldset>
    </ly-form-model>
  </ly-modal>
</template>

<style scoped></style>
