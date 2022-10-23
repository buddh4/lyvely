<script lang="ts" setup>
import useEditActivityModal from "../useEditActivityModal";
import VueMultiselect from "vue-multiselect";

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
        :required="true"
        data-habit-title
        label="Title"
        :error="validator.getError('title')"
      />

      <ly-input-select
        v-model="model.interval"
        :required="true"
        data-habit-interval
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

      <div
        class="grid grid-flow-col grid-cols-2 grid-rows-2 gap-2 mb-3 p-3 border border-divide rounded bg-highlight dark:bg-main"
      >
        <div>
          <ly-input-text
            v-model="model.max"
            data-habit-rating-max
            label="Max"
            :error="validator.getError('max')"
            :min="1"
          />
        </div>
        <div>
          <ly-input-text
            v-model="model.score"
            data-habit-rating-value
            label="Score ★"
            :mb="0"
            :error="validator.getError('score')"
            :steps="2"
            :max="100"
            :min="-100"
          />
        </div>

        <div>
          <ly-input-number
            v-model="model.min"
            data-habit-rating-min
            label="Min"
            :min="0"
            :max="model.max"
            :error="validator.getError('min')"
          />
        </div>
        <div>
          <ly-input-number
            v-model="model.optimal"
            data-habit-rating-optimal
            label="Optimal"
            :min="model.min"
            :max="model.max"
            :error="validator.getError('optimal')"
          />
        </div>
      </div>

      <ly-input-textarea
        v-model="model.text"
        data-habit-description
        label="Description"
      />
    </fieldset>

    <ly-alert :message="error" class="mt-2" />
    <ly-screen-reader-validation-error :errors="validator?.getErrors()" />
  </ly-modal>
</template>

<style scoped></style>
