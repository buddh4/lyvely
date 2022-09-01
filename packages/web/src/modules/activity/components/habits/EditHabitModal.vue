<script lang="ts" setup>
import Modal from "@/modules/ui/components/modal/Modal.vue";
import TextInput from "@/modules/ui/components/form/TextInput.vue";
import SelectInput from "@/modules/ui/components/form/SelectInput.vue";
import NumberInput from '@/modules/ui/components/form/NumberInput.vue';
import Textarea from '@/modules/ui/components/form/Textarea.vue';
import useEditActivityModal from '../useEditActivityModal';
import VueMultiselect from 'vue-multiselect';
import Alert from "@/modules/ui/components/alert/Alert.vue";

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
  <Modal
      v-model="showModal"
      :title="modalTitle"
      @submit="submit"
      @hide="reset">
    <template #body>
      <fieldset>
        <TextInput
            v-model="model.title"
            :required="true"
            data-habit-title
            label="Title"
            :error="validator.getError('title')"/>

        <SelectInput
            v-model="model.interval"
            :required="true"
            data-habit-interval
            label="Plan"
            :options="calendarPlanOptions"
            :error="validator.getError('interval')"/>

        <VueMultiselect
            v-model="model.tagNames"
            class="form-input"
            :options="tagOptions"
            :multiple="true"
            :taggable="true"
            tag-placeholder="Add this as new tag" placeholder="Search or add a tag"
            @tag="addTag" />

        <div class="grid grid-flow-col grid-cols-2 grid-rows-2 gap-2 mb-3 p-3 border border-divide rounded bg-highlight dark:bg-main">
          <div>
            <NumberInput
                v-model="model.max"
                data-habit-rating-max
                label="Max"
                :error="validator.getError('max')"
                :min="1"/>
          </div>
          <div>
            <NumberInput
                v-model="model.score"
                data-habit-rating-value
                label="Score ★"
                :mb="0"
                :error="validator.getError('score')"
                :steps="2"
                :max="100"
                :min="-100"/>
          </div>

          <div>
            <NumberInput
                v-model="model.min"
                data-habit-rating-min
                label="Min"
                :min="0"
                :max="model.max"
                :error="validator.getError('min')"/>
          </div>
          <div>
            <NumberInput
                v-model="model.optimal"
                data-habit-rating-optimal
                label="Optimal"
                :min="model.min"
                :max="model.max"
                :error="validator.getError('optimal')"/>
          </div>
        </div>

        <Textarea
            v-model="model.text"
            data-habit-description
            label="Description"/>
      </fieldset>

      <Alert :message="error" class="mt-2" />
      <ScreenReaderValidationError :errors="validator.getErrors()" />
    </template>
  </Modal>
</template>

<style scoped></style>
