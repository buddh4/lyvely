<script lang="ts" setup>
import Modal from "@/modules/ui/components/modal/Modal.vue";
import TextInput from "@/modules/ui/components/form/TextInput.vue";
import SelectInput from "@/modules/ui/components/form/SelectInput.vue";
import Multiselect from "@vueform/multiselect";
import NumberInput from '@/modules/ui/components/form/NumberInput.vue';
import Textarea from '@/modules/ui/components/form/Textarea.vue';
import VueMultiselect from 'vue-multiselect'
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

function addTag (newTag: string) {
  model.value!.tagNames!.push(newTag);
}

</script>

<template>
  <Modal
      v-model="showModal"
      :title="modalTitle"
      @submit="onSubmit"
      @hide="onHide">
    <template #body>
      <fieldset>
        <TextInput
            v-model="model.title"
            data-habit-title
            label="Title"
            :error="getError('title')"/>

        <SelectInput
            v-model="model.interval"
            data-habit-interval
            label="Plan"
            :options="calendarPlanOptions"
            :error="getError('interval')"/>

        <VueMultiselect
            v-model="model.tagNames"
            class="mb-3"
            :options="tagOptions"
            :multiple="true"
            :taggable="true"
            tag-placeholder="Add this as new tag" placeholder="Search or add a tag"
            @tag="addTag" />


        <!--Multiselect
            v-model="model.tagNames"
            data-habit-categories
            class="mb-3 border-divide"
            mode="tags"
            placeholder="Add Tags"
            :classes="{
          containerActive: 'ring ring-blue-200 border-blue-300 ring-opacity-50',
          tag: 'bg-success text-white text-sm py-0.5 pl-2 rounded mr-1 mb-1 flex items-center whitespace-nowrap',
        }"
            :searchable="true"
            :create-tag="true"
            :options="tagOptions"/ -->

        <div class="grid grid-flow-col grid-cols-2 grid-rows-2 gap-2 mb-3 p-3 border border-divide rounded bg-gray-50 dark:bg-slate-900">
          <div>
            <NumberInput
                v-model="model.max"
                data-habit-rating-max
                label="Max"
                :error="getError('max')"
                :min="1"/>
          </div>
          <div>
            <NumberInput
                v-model="model.score"
                data-habit-rating-value
                label="Score ★"
                :mb="0"
                :error="getError('score')"
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
                :error="getError('min')"/>
          </div>
          <div>
            <NumberInput
                v-model="model.optimal"
                data-habit-rating-optimal
                label="Optimal"
                :min="model.min"
                :max="model.max"
                :error="getError('optimal')"/>
          </div>
        </div>

        <Textarea
            v-model="model.text"
            data-habit-description
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
