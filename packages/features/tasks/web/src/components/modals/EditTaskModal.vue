<script lang="ts" setup>
import { computed } from 'vue';
import {
  TagChooser,
  ContentEditModalEmits,
  useContentEditModal,
  ICreateContentInitOptions,
} from '@lyvely/web';
import {
  isTouchScreen,
  LyModal,
  LyFormModel,
  LyTextField,
  LySelect,
  LyTextarea,
  LyNumberField,
} from '@lyvely/ui';
import { TaskModel, UpdateTaskModel, CreateTaskModel } from '@lyvely/tasks-interface';
import { useTasksService } from '@/services';
import { getCalendarPlanOptions } from '@lyvely/calendar-plan-web';

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
        <ly-text-field
          property="title"
          :required="true"
          :autofocus="isCreate || !isTouchScreen()"
          :auto-validation="false" />
        <ly-textarea property="text" />
      </fieldset>

      <fieldset>
        <div class="grid grid-flow-row grid-cols-2 gap-2">
          <ly-select
            property="interval"
            label="common.fields.interval_plural"
            :required="true"
            :options="getCalendarPlanOptions('plural')" />
          <ly-number-field property="score" :mb="0" :steps="2" :max="100" :min="-100" />
        </div>
      </fieldset>

      <fieldset>
        <tag-chooser v-model="model.tagNames" />
      </fieldset>
      <fieldset></fieldset>
    </ly-form-model>
  </ly-modal>
</template>

<style scoped></style>
