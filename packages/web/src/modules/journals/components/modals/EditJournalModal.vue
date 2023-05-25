<script lang="ts" setup>
import {
  CreateJournalModel,
  DataPointInputType,
  DataPointValueType,
  JournalModel,
  UpdateJournalModel,
} from '@lyvely/common';
import { computed } from 'vue';
import TagChooser from '@/modules/tags/components/TagChooser.vue';
import {
  ContentEditModalEmits,
  useContentEditModal,
} from '@/modules/content/composables/content-edit-modal.composable';
import { getCalendarPlanOptions } from '@/modules/calendar-plan';
import { isTouchScreen } from '@/util';
import { ICreateContentInitOptions } from '@/modules/content/interfaces/edit-content-modal-props.interface';
import { useJournalsService } from '@/modules/journals/services/journals.service';
import NumberDataPointConfigForm from '@/modules/time-series/components/NumberDataPointConfigForm.vue';
import TextDataPointConfigForm from '@/modules/time-series/components/TextDataPointConfigForm.vue';
import SelectionDataPointConfigForm from '@/modules/time-series/components/SelectionDataPointConfigForm.vue';

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
  service: useJournalsService(),
});

function setValueType(valueType: CreateJournalModel['valueType']) {
  debugger;
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
      label-key="activities.fields">
      <fieldset>
        <ly-input-text
          property="title"
          :required="true"
          :autofocus="isCreate || !isTouchScreen()"
          :auto-validation="false" />
        <ly-input-select property="interval" :required="true" :options="calendarPlanOptions" />
      </fieldset>

      <fieldset>
        <div class="flex flex-col gap-2">
          <div class="flex gap-2 justify-between items-stretch">
            <ly-button
              class="text-xs secondary w-full"
              :active="model.valueType === DataPointValueType.Number"
              @click="setValueType(DataPointValueType.Number)">
              {{ $t('calendar-plan.value_types.number') }}
            </ly-button>

            <ly-button
              class="text-xs secondary w-full"
              :active="model.valueType === DataPointValueType.Text"
              @click="setValueType(DataPointValueType.Text)">
              {{ $t('calendar-plan.value_types.text') }}
            </ly-button>

            <ly-button
              class="text-xs secondary w-full"
              :active="model.valueType === DataPointValueType.Selection"
              @click="setValueType(DataPointValueType.Selection)">
              {{ $t('calendar-plan.value_types.selection') }}
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
        <tag-chooser v-model="model.tagNames" />
        <ly-input-textarea property="text" />
      </fieldset>
    </ly-form-model>
  </ly-modal>
</template>

<style scoped></style>
