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
import { useContentEditModal } from '@/modules/content/composables/content-edit-modal.composable';
import { getCalendarPlanOptions } from '@/modules/calendar-plan';
import { isTouchScreen } from '@/util';
import { ICreateContentInitOptions } from '@/modules/content/interfaces/edit-content-modal-props.interface';
import { useJournalsService } from '@/modules/journals/services/journals.service';
import { NumberDataPointConfigForm } from '@/modules/calendar-plan/components/NumberDataPointConfigForm.vue';
import TextDataPointConfig from '@/modules/calendar-plan/components/TextDataPointConfig.vue';
import SelectionDataPointConfig from '@/modules/calendar-plan/components/SelectionDataPointConfig.vue';

export interface IProps {
  modelValue: boolean;
  content?: JournalModel;
  type: string;
  initOptions?: ICreateContentInitOptions;
}

const props = defineProps<IProps>();
const emit = defineEmits(['update:modelValue']);

const { isCreate, showModal, model, validator, submit, status } = useContentEditModal<
  JournalModel,
  CreateJournalModel,
  UpdateJournalModel
>(props, emit, {
  service: useJournalsService(),
});

function setValueType(valueType: string) {
  if (!model.value) return;
  model.value.valueType = valueType;
  // TODO: Move this somewhere else...
  if (valueType === DataPointValueType.Number) {
    model.value.inputType = DataPointInputType.Checkbox;
  } else if (valueType === DataPointValueType.Text) {
    model.value.inputType = DataPointInputType.Textarea;
  }
}

const calendarPlanOptions = computed(() => getCalendarPlanOptions());

const modalTitle = computed(() => {
  return isCreate.value ? `journals.edit.title` : `journals.create.title`;
});
</script>

<template>
  <ly-modal v-model="showModal" :title="modalTitle" @submit="submit">
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
              {{ $t('calendar.plan.value_types.number') }}
            </ly-button>

            <ly-button
              class="text-xs secondary w-full"
              :active="model.valueType === DataPointValueType.Text"
              @click="setValueType(DataPointValueType.Text)">
              {{ $t('calendar.plan.value_types.text') }}
            </ly-button>

            <ly-button
              class="text-xs secondary w-full"
              :active="model.valueType === DataPointValueType.Selection"
              @click="setValueType(DataPointValueType.Selection)">
              {{ $t('calendar.plan.value_types.selection') }}
            </ly-button>
          </div>

          <number-data-point-config-form
            v-if="model.valueType === DataPointValueType.Number"
            v-model="model" />
          <text-data-point-config
            v-else-if="model.valueType === DataPointValueType.Text"
            v-model="model" />
          <selection-data-point-config
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
