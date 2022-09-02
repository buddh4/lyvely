<script lang="ts" setup>
import Modal from '@/modules/ui/components/modal/Modal.vue';
import SelectInput from '@/modules/ui/components/form/SelectInput.vue';
import { EditJournalDto , DataPointInputType } from '@lyvely/common';
import TextInput from '@/modules/ui/components/form/TextInput.vue';
import NumberInput from '@/modules/ui/components/form/NumberInput.vue';
import Textarea from '@/modules/ui/components/form/Textarea.vue';
import { computed } from 'vue';

interface Props {
  modelValue: boolean,
  create: boolean,
  model: EditJournalDto
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue', 'success']);

function getJournalTypeOptions() {
  return [
    {value: DataPointInputType.Textarea, label: 'Note'},
    {value: DataPointInputType.Range, label: 'Range'}
  ];
}

function changeInputType() {
  switch (props.model.inputType) {
    case DataPointInputType.Range:
      props.model.logValueType = DataPointInputType.Range;
      break;
    case DataPointInputType.Textarea:
      props.model.logValueType = DataPointInputType.Textarea;
      break;
  }

  this.validate();
}


const isInputTypeNumber = computed(() => [DataPointInputType.Range].includes(props.model.inputType));
const isInputTypeRange = computed(() => props.model.inputType === DataPointInputType.Range);
const title = computed(() => props.create ? 'Add journal' : 'Edit journal');
</script>

<template>
  <Modal v-if="model" v-model="state" :title="title" @submit="submit">
      <TextInput
        v-model="props.model.title"
        label="Title"
        :error="getError('title')"
        @change="validate"
      />
      <SelectInput
        v-model="props.model.plan"
        label="Plan"
        :options="calendarPlanOptions"
        :error="getError('plan')"
        @change="validate"
      />


      <SelectInput
        v-model="props.model.inputType"
        label="Type"
        :options="journalTypeOptions"
        :error="getError('type')"
        @change="changeInputType"
      />

      <div v-if="isInputTypeRange" class="row g-2">
        <div class="col">
          <NumberInput
            v-model="props.model.max"
            label="Max"
            :error="getError('max')"
            :min="1"
            @change="validate"
          />
        </div>
        <div class="col">
          <NumberInput
            v-model="props.model.min"
            label="Min"
            :max="model.max"
            :error="getError('min')"
            :mb="0"
            @change="validate"
          />
        </div>
      </div>

      <Textarea
        v-model="props.model.description"
        label="Description"
        @change="validate"
      />
  </Modal>
</template>

<style scoped></style>
