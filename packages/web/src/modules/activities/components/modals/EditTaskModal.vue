<script lang="ts" setup>
import useEditActivityModal from '../useEditActivityModal';
import { computed } from 'vue';
import TagChooser from '@/modules/tags/components/TagChooser.vue';

const {
  model,
  status,
  isCreate,
  showModal,
  validator,
  addTag,
  reset,
  submit,
  calendarPlanOptions,
} = useEditActivityModal();

const modalTitle = computed(() => {
  return isCreate.value ? `activities.tasks.create.title` : `activities.tasks.edit.title`;
});
</script>

<template>
  <ly-modal
    v-if="model && validator"
    v-model="showModal"
    :title="modalTitle"
    @submit="submit"
    @hide="reset">
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
