<script lang="ts" setup>
import { computed } from 'vue';
import TagChooser from '@/modules/tags/components/TagChooser.vue';
import { useContentEditModal } from '@/modules/content/composables/content-edit-modal.composable';
import { CreateTaskModel, TaskModel, UpdateTaskModel } from '@lyvely/common';
import { useTasksService } from '@/modules/tasks/common/services/tasks.service';
import { getCalendarPlanOptions } from '@/modules/calendar-plan';
import { isTouchScreen } from '@/util';
import { ICreateContentInitOptions } from '@/modules/content/interfaces/edit-content-modal-props.interface';

export interface IProps {
  modelValue: boolean;
  content?: TaskModel;
  type: string;
  initOptions?: ICreateContentInitOptions;
}

const props = defineProps<IProps>();
const emit = defineEmits(['update:modelValue']);
const store = useContentEditModal<TaskModel, CreateTaskModel, UpdateTaskModel>(props, emit, {
  service: useTasksService(),
});

const { showModal, isCreate, model, validator, submit, status } = store;

const modalTitle = computed(() => {
  return isCreate.value ? `activities.tasks.create.title` : `activities.tasks.edit.title`;
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
        <ly-input-select property="interval" :required="true" :options="getCalendarPlanOptions()" />
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
