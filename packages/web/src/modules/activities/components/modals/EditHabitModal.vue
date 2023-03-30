<script lang="ts" setup>
import { CreateHabitModel, DataPointInputType, HabitModel, UpdateHabitModel } from '@lyvely/common';
import { computed } from 'vue';
import TagChooser from '@/modules/tags/components/TagChooser.vue';
import { useContentEditModal } from '@/modules/content/composables/content-edit-modal.composable';
import { useHabitsService } from '@/modules/activities/services/habits.service';
import { getCalendarPlanOptions } from '@/modules/calendar-plan';
import { isTouchScreen } from '@/util';
import { ICreateContentInitOptions } from '@/modules/content/interfaces/edit-content-modal-props.interface';
import NumberDataPointConfig from '@/modules/calendar-plan/components/NumberDataPointConfig.vue';

export interface IProps {
  modelValue: boolean;
  content?: HabitModel;
  type: string;
  initOptions?: ICreateContentInitOptions;
}

const props = defineProps<IProps>();
const emit = defineEmits(['update:modelValue']);

const { isCreate, showModal, model, validator, submit, status } = useContentEditModal<
  HabitModel,
  CreateHabitModel,
  UpdateHabitModel
>(props, emit, {
  service: useHabitsService(),
});

const calendarPlanOptions = computed(() => getCalendarPlanOptions());

const modalTitle = computed(() => {
  return isCreate.value ? `activities.habits.edit.title` : `activities.habits.create.title`;
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
        <number-data-point-config v-model="model" :score="true" />
      </fieldset>

      <fieldset>
        <tag-chooser v-model="model.tagNames" />
        <ly-input-textarea property="text" />
      </fieldset>
    </ly-form-model>
  </ly-modal>
</template>

<style scoped></style>
