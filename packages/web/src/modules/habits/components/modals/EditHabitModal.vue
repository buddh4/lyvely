<script lang="ts" setup>
import { CreateHabitModel, HabitModel, UpdateHabitModel } from '@lyvely/common';
import { computed } from 'vue';
import TagChooser from '@/modules/tags/components/TagChooser.vue';
import {
  ContentEditModalEmits,
  useContentEditModal,
} from '@/modules/content/composables/content-edit-modal.composable';
import { useHabitsService } from '@/modules/habits/services/habits.service';
import { getCalendarPlanOptions } from '@/modules/calendar-plan';
import { isTouchScreen } from '@/util';
import { ICreateContentInitOptions } from '@/modules/content/interfaces/edit-content-modal-props.interface';
import NumberDataPointConfigForm from '@/modules/time-series/components/NumberDataPointConfigForm.vue';

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
  service: useHabitsService(),
});

const calendarPlanOptions = computed(() => getCalendarPlanOptions());

const modalTitle = computed(() => {
  return isCreate.value ? `habits.create.title` : `habits.edit.title`;
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
        <ly-input-text
          property="title"
          :required="true"
          :autofocus="isCreate || !isTouchScreen()"
          :auto-validation="false" />
        <ly-input-select property="interval" :required="true" :options="calendarPlanOptions" />
      </fieldset>

      <fieldset>
        <number-data-point-config-form
          v-model="model"
          :is-create="isCreate"
          :timer="true"
          :score="true" />
      </fieldset>

      <fieldset>
        <tag-chooser v-model="model.tagNames" />
        <ly-input-textarea property="text" />
      </fieldset>
    </ly-form-model>
  </ly-modal>
</template>

<style scoped></style>
