<script lang="ts" setup>
import Modal from "@/modules/ui/components/modal/Modal.vue";
import TextInput from "@/modules/ui/components/form/TextInput.vue";
import SelectInput from "@/modules/ui/components/form/SelectInput.vue";
import VueMultiselect from 'vue-multiselect';
import NumberInput from '@/modules/ui/components/form/NumberInput.vue';
import Textarea from '@/modules/ui/components/form/Textarea.vue';
import Alert from "@/modules/ui/components/alert/Alert.vue";
import useEditActivityModal from '../useEditActivityModal';
import ScreenReaderValidationError from "@/modules/ui/components/error/ScreenReaderValidationError.vue";

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
  <Modal v-model="showModal" :title="modalTitle" @submit="submit" @hide="reset">
    <template #body>
      <fieldset>
        <TextInput
            v-model="model.title"
            label="Title"
            :error="validator.getError('title')"/>

        <SelectInput
            v-model="model.interval"
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

        <NumberInput
            v-model="model.score"
            label="★ Score"
            :error="validator.getError('score')"
            :steps="2"
            :max="100"
            :min="-100"/>

        <Textarea
            v-model="model.text"
            label="Description"/>
      </fieldset>

      <Alert :message="error" class="mt-2" />
      <ScreenReaderValidationError :errors="validator.getErrors()" />
    </template>
  </Modal>
</template>

<style scoped></style>
