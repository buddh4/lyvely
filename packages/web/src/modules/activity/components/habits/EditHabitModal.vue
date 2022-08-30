<script lang="ts" setup>
import Modal from "@/modules/ui/components/modal/Modal.vue";
import TextInput from "@/modules/ui/components/form/TextInput.vue";
import SelectInput from "@/modules/ui/components/form/SelectInput.vue";
import NumberInput from '@/modules/ui/components/form/NumberInput.vue';
import Textarea from '@/modules/ui/components/form/Textarea.vue';
import useEditActivityModal from '../useEditActivityModal';
import VueMultiselect from 'vue-multiselect'

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
