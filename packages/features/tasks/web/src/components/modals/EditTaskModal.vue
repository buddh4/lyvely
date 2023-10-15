<script lang="ts" setup>
import { computed } from 'vue';
import {
  TagChooser,
  isTouchScreen,
  ContentEditModalEmits,
  useContentEditModal,
  ICreateContentInitOptions,
} from '@lyvely/web';
import { TaskModel, UpdateTaskModel, CreateTaskModel } from '@lyvely/tasks-interface';
import { useTasksService } from '@/services';
import { getCalendarPlanOptions } from '@lyvely/calendar-plan-web';
import {
  LyModal,
  LyFormModel,
  LyInputText,
  LyInputSelect,
  LyInputTextarea,
  LyInputNumber,
} from '@lyvely/ui';

export interface IProps {
  modelValue: boolean;
  content?: TaskModel;
  type: string;
  initOptions?: ICreateContentInitOptions;
}

const props = defineProps<IProps>();
const emit = defineEmits(ContentEditModalEmits);
const store = useContentEditModal<TaskModel, CreateTaskModel, UpdateTaskModel>(props, emit, {
  service: useTasksService(),
});

const { showModal, isCreate, model, validator, submit, status } = store;

const modalTitle = computed(() => {
  return isCreate.value ? `tasks.create.title` : `tasks.edit.title`;
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
        <ly-input-select
          property="interval"
          label="common.fields.interval_plural"
          :required="true"
          :options="getCalendarPlanOptions('plural')" />
      </fieldset>
      <fieldset>
        <tag-chooser v-model="model.tagNames" />
      </fieldset>
      <fieldset>
        <ly-input-number property="score" :mb="0" :steps="2" :max="100" :min="-100" />
        <ly-input-textarea property="text" />
      </fieldset>
    </ly-form-model>
  </ly-modal>
</template>

<style scoped></style>
