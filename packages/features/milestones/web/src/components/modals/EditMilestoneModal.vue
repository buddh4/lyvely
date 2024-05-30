<script lang="ts" setup>
import { computed } from 'vue';
import {
  TagPicker,
  ContentEditModalEmits,
  useContentEditModal,
  ICreateContentInitOptions,
} from '@lyvely/web';
import { isTouchScreen, LyModal, LyFormModel, LyTextField, LyTextarea, LySelect } from '@lyvely/ui';
import {
  CreateMilestoneModel,
  MilestoneModel,
  UpdateMilestoneModel,
  useMilestonesClient,
} from '@lyvely/milestones-interface';
import { getCalendarPlanOptions } from '@lyvely/calendar-plan-web';

export interface IProps {
  modelValue: boolean;
  content?: MilestoneModel;
  type: string;
  initOptions?: ICreateContentInitOptions;
}

const props = defineProps<IProps>();
const emit = defineEmits(ContentEditModalEmits);
const store = useContentEditModal<MilestoneModel, CreateMilestoneModel, UpdateMilestoneModel>(
  props,
  emit,
  {
    client: useMilestonesClient(),
  }
);

const { showModal, isCreate, model, validator, submit, status } = store;

const modalTitle = computed(() => {
  return isCreate.value ? `milestones.create.title` : `milestones.edit.title`;
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
        <ly-text-field
          property="title"
          :required="true"
          :autofocus="isCreate || !isTouchScreen()"
          :auto-validation="false" />
        <ly-select
          property="interval"
          label="common.fields.interval_plural"
          :required="true"
          :options="getCalendarPlanOptions('plural')" />
      </fieldset>
      <fieldset>
        <tag-picker v-model="model.tagNames" option-key="name" />
      </fieldset>
      <fieldset>
        <ly-textarea property="text" />
      </fieldset>
    </ly-form-model>
  </ly-modal>
</template>

<style scoped></style>
