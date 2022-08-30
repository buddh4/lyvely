<script lang="ts" setup>
import Modal from "@/modules/ui/components/modal/Modal.vue";
import TextInput from "@/modules/ui/components/form/TextInput.vue";
import SelectInput from "@/modules/ui/components/form/SelectInput.vue";
import VueMultiselect from 'vue-multiselect';
import NumberInput from '@/modules/ui/components/form/NumberInput.vue';
import Textarea from '@/modules/ui/components/form/Textarea.vue';
import useEditActivityModal from '../useEditActivityModal';

const {
  model,
  modalTitle,
  showModal,
  getError,
  getErrors,
  onHide,
  onSubmit,
  tagOptions,
  calendarPlanOptions,
} = useEditActivityModal();

</script>

<template>
  <Modal v-model="showModal" :title="modalTitle" @submit="onSubmit" @hide="onHide">
    <template #body>
      <fieldset>
        <TextInput
            v-model="model.title"
            label="Title"
            :error="getError('title')"/>

        <SelectInput
            v-model="model.interval"
            label="Plan"
            :options="calendarPlanOptions"
            :error="getError('interval')"/>

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
            :error="getError('score')"
            :steps="2"
            :max="100"
            :min="-100"/>

        <Textarea
            v-model="model.description"
            label="Description"/>
      </fieldset>

      <div class="sr-only">
        <ul>
          <li v-for="error in getErrors()" :key="error">{{ error }}</li>
        </ul>
      </div>
    </template>
  </Modal>
</template>

<style scoped></style>
