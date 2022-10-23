<script lang="ts" setup>
import VueMultiselect from "vue-multiselect";
import useEditActivityModal from "../useEditActivityModal";

const {
  model,
  modalTitle,
  showModal,
  validator,
  addTag,
  error,
  reset,
  submit,
  tagOptions,
  calendarPlanOptions,
} = useEditActivityModal();
</script>

<template>
  <ly-modal
      v-if="model && validator"
      v-model="showModal"
      :title="modalTitle"
      @submit="submit"
      @hide="reset"
  >
    <fieldset>
      <ly-input-text
          v-model="model.title"
          label="Title"
          :error="validator.getError('title')"
      />

      <ly-input-select
          v-model="model.interval"
          label="Plan"
          :options="calendarPlanOptions"
          :error="validator.getError('interval')"
      />

      <VueMultiselect
          v-model="model.tagNames"
          class="form-input"
          :options="tagOptions"
          :multiple="true"
          :taggable="true"
          tag-placeholder="Add this as new tag"
          placeholder="Search or add a tag"
          @tag="addTag"
      />

      <ly-input-number
          v-model="model.score"
          label="★ Score"
          :error="validator.getError('score')"
          :steps="2"
          :max="100"
          :min="-100"
      />

      <ly-input-textarea v-model="model.text" label="Description"/>
    </fieldset>

    <ly-alert :message="error" class="mt-2"/>
    <ly-screen-reader-validation-error :errors="validator.getErrors()"/>
  </ly-modal>
</template>

<style scoped></style>
