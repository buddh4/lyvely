<script lang="ts" setup>
import Modal from "@/modules/ui/components/modal/Modal.vue";
import TextInput from "@/modules/ui/components/form/TextInput.vue";
import SelectInput from "@/modules/ui/components/form/SelectInput.vue";
import Multiselect from "@vueform/multiselect";
import NumberInput from '@/modules/ui/components/form/NumberInput.vue';
import Textarea from '@/modules/ui/components/form/Textarea.vue';
import useEditActivityModal from '../useEditActivityModal';

const {
  model,
  modalTitle,
  showModal,
  getError,
  onHide,
  onSubmit,
  categoryOptions,
  calendarPlanOptions,
} = useEditActivityModal();

</script>

<template>
  <Modal v-model="showModal" :title="modalTitle" @submit="onSubmit" @hide="onHide">

    <template #body>
      <TextInput
        v-model="model.title"
        label="Title"
        :error="getError('title')"/>
      <SelectInput
        v-model="model.plan"
        label="Plan"
        :options="calendarPlanOptions"
        :error="getError('plan')"/>

      <Multiselect
        v-model="model.categories"
        class="mb-3"
        mode="tags"
        placeholder="Categories..."
        :searchable="true"
        :create-tag="true"
        :options="categoryOptions"/>

      <NumberInput
        v-model="model.value"
        label="★ Score"
        :error="getError('value')"
        :steps="2"
        :max="100"
        :min="-100"/>

      <Textarea
        v-model="model.description"
        label="Description"/>
    </template>
  </Modal>
</template>

<style scoped></style>
