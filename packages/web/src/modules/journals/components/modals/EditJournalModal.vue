<script lang="ts" setup>
import {
  DataPointInputType,
  JournalModel,
  CreateJournalModel,
  UpdateJournalModel,
} from '@lyvely/common';
import { computed } from 'vue';
import TagChooser from '@/modules/tags/components/TagChooser.vue';
import { useContentEditModal } from '@/modules/content/composables/content-edit-modal.composable';
import { getCalendarPlanOptions } from '@/modules/calendar-plan';
import { isTouchScreen } from '@/util';
import { ICreateContentInitOptions } from '@/modules/content/interfaces/edit-content-modal-props.interface';
import { useJournalsService } from '@/modules/journals/services/journals.service';

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

function setInputType(inputType: DataPointInputType) {
  if (!model.value) return;
  const modelValue = model.value;
  modelValue.inputType = inputType;
  if (modelValue.inputType === DataPointInputType.Checkbox && modelValue.max! > 8) {
    modelValue.max = 8;
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
        <div class="flex flex-col gap-2 border border-divide rounded bg-highlight dark:bg-main p-3">
          <div class="flex gap-2 justify-between items-stretch">
            <ly-button
              class="text-xs secondary w-full"
              :active="model.inputType === DataPointInputType.Checkbox"
              @click="setInputType(DataPointInputType.Checkbox)">
              {{ $t('activities.input_types.checkbox') }}
            </ly-button>

            <ly-button
              class="text-xs secondary w-full"
              :active="model.inputType === DataPointInputType.Spinner"
              @click="setInputType(DataPointInputType.Spinner)">
              {{ $t('activities.input_types.spinner') }}
            </ly-button>

            <ly-button
              class="text-xs secondary w-full"
              :active="model.inputType === DataPointInputType.Time"
              @click="setInputType(DataPointInputType.Time)">
              {{ $t('activities.input_types.time') }}
            </ly-button>

            <ly-button
              class="text-xs secondary w-full"
              :active="model.inputType === DataPointInputType.Range"
              @click="setInputType(DataPointInputType.Range)">
              {{ $t('activities.input_types.range') }}
            </ly-button>
          </div>

          <div class="grid grid-flow-col grid-cols-2 grid-rows-2 gap-2">
            <div>
              <ly-input-number
                v-if="model.inputType === DataPointInputType.Checkbox"
                property="max"
                :min="1"
                :max="8" />
              <ly-input-time-number
                v-else-if="model.inputType === DataPointInputType.Time"
                property="max" />
              <ly-input-number v-else property="max" :min="1" />
            </div>

            <div>
              <ly-input-time-number
                v-if="model.inputType === DataPointInputType.Time"
                property="min"
                :max="model.max" />
              <ly-input-number v-else property="min" :min="0" :max="model.max" />
            </div>
            <div>
              <ly-input-time-number
                v-if="model.inputType === DataPointInputType.Time"
                property="optimal"
                :min="model.min"
                :max="model.max" />
              <ly-input-number v-else property="optimal" :min="model.min" :max="model.max" />
            </div>
            <div class="flex flex-col">
              <ly-input-number property="score" :mb="0" :steps="2" :max="100" :min="-100" />
              <div
                v-if="model.inputType === DataPointInputType.Time"
                class="flex border border-divide bg-highlight rounded h-full p-2 text-xs text-dimmed gap-2">
                <div>
                  <ly-icon name="info" class="text-info-light" />
                </div>
                <div>
                  {{ $t('activities.habits.timer_score_info') }}
                </div>
              </div>
            </div>
          </div>
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
