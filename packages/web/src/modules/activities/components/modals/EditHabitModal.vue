<script lang="ts" setup>
import useEditActivityModal from '../useEditActivityModal';
import { CreateHabitModel, DataPointInputType, HabitModel } from '@lyvely/common';
import { computed, Ref } from 'vue';
import TagChooser from '@/modules/tags/components/TagChooser.vue';

interface IProps {
  modelValue: boolean;
  content?: HabitModel;
}

const props = defineProps<IProps>();
const emit = defineEmits(['update:modelValue', 'hide']);

const { validator, submit, calendarPlanOptions, status } = useEditActivityModal(props);

function setInputType(inputType: DataPointInputType) {
  model.inputType = inputType;
  if (model.inputType === DataPointInputType.Checkbox && model.max! > 8) {
    model.max = 8;
  }
}

const modalTitle = computed(() => {
  return props.content ? `activities.habits.edit.title` : `activities.habits.create.title`;
});
</script>

<template>
  <ly-modal
    v-if="model && validator"
    v-model="isVisible"
    :title="modalTitle"
    @submit="submit"
    @hide="$emit('hide')">
    <ly-form-model
      v-model="model"
      :validator="validator"
      :status="status"
      label-key="activities.fields">
      <fieldset>
        <ly-input-text property="title" :required="true" :autofocus="true" />
        <ly-input-select property="interval" :required="true" :options="calendarPlanOptions" />
      </fieldset>

      <fieldset>
        <div class="flex flex-col gap-2 border border-divide rounded bg-highlight dark:bg-main p-3">
          <div class="flex gap-2 justify-between items-stretch">
            <ly-button
              class="text-xs secondary w-full"
              :active="editModel.inputType === DataPointInputType.Checkbox"
              @click="setInputType(DataPointInputType.Checkbox)">
              {{ $t('activities.input_types.checkbox') }}
            </ly-button>

            <ly-button
              class="text-xs secondary w-full"
              :active="editModel.inputType === DataPointInputType.Spinner"
              @click="setInputType(DataPointInputType.Spinner)">
              {{ $t('activities.input_types.spinner') }}
            </ly-button>

            <ly-button
              class="text-xs secondary w-full"
              :active="editModel.inputType === DataPointInputType.Time"
              @click="setInputType(DataPointInputType.Time)">
              {{ $t('activities.input_types.time') }}
            </ly-button>

            <ly-button
              class="text-xs secondary w-full"
              :active="editModel.inputType === DataPointInputType.Range"
              @click="setInputType(DataPointInputType.Range)">
              {{ $t('activities.input_types.range') }}
            </ly-button>
          </div>

          <div class="grid grid-flow-col grid-cols-2 grid-rows-2 gap-2">
            <div>
              <ly-input-number
                v-if="editModel.inputType === DataPointInputType.Checkbox"
                property="max"
                :min="1"
                :max="8" />
              <ly-input-time-number
                v-else-if="editModel.inputType === DataPointInputType.Time"
                property="max" />
              <ly-input-number v-else property="max" :min="1" />
            </div>

            <div>
              <ly-input-time-number
                v-if="editModel.inputType === DataPointInputType.Time"
                property="min"
                :max="editModel.max" />
              <ly-input-number v-else property="min" :min="0" :max="editModel.max" />
            </div>
            <div>
              <ly-input-time-number
                v-if="editModel.inputType === DataPointInputType.Time"
                property="optimal"
                :min="editModel.min"
                :max="editModel.max" />
              <ly-input-number
                v-else
                property="optimal"
                :min="editModel.min"
                :max="editModel.max" />
            </div>
            <div class="flex flex-col">
              <ly-input-number property="score" :mb="0" :steps="2" :max="100" :min="-100" />
              <div
                v-if="editModel.inputType === DataPointInputType.Time"
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
        <tag-chooser v-model="editModel.tagNames" />
        <ly-input-textarea property="text" />
      </fieldset>
    </ly-form-model>
  </ly-modal>
</template>

<style scoped></style>
