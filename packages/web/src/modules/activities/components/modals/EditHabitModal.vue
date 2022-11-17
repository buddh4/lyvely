<script lang="ts" setup>
import useEditActivityModal from '../useEditActivityModal';
import VueMultiselect from 'vue-multiselect';
import { DataPointInputType } from '@lyvely/common';

const { model, modalTitle, showModal, validator, addTag, reset, submit, tagOptions, calendarPlanOptions, status } =
  useEditActivityModal();

function setInputType(inputType: DataPointInputType) {
  if (model.value) {
    model.value.inputType = inputType;
    if (model.value.inputType === DataPointInputType.Checkbox && model.value.max! > 8) {
      model.value.max = 8;
    }
  }
}
</script>

<template>
  <ly-modal v-if="model && validator" v-model="showModal" :title="modalTitle" @submit="submit" @hide="reset">
    <ly-form-model v-model="model" :validator="validator" :status="status" label-key="activities.fields">
      <fieldset>
        <ly-input-text property="title" :required="true" />
        <ly-input-select property="interval" :required="true" :options="calendarPlanOptions" />
      </fieldset>

      <fieldset>
        <div class="flex flex-col gap-2 border border-divide rounded bg-highlight dark:bg-main p-3">
          <div class="flex gap-2 justify-between items-stretch">
            <ly-button
              class="text-xs secondary w-full"
              :active="model.inputType === DataPointInputType.Checkbox"
              @click="setInputType(DataPointInputType.Checkbox)"
            >
              {{ $t('activities.input_types.checkbox') }}
            </ly-button>

            <ly-button
              class="text-xs secondary w-full"
              :active="model.inputType === DataPointInputType.Spinner"
              @click="setInputType(DataPointInputType.Spinner)"
            >
              {{ $t('activities.input_types.spinner') }}
            </ly-button>

            <ly-button
              class="text-xs secondary w-full"
              :active="model.inputType === DataPointInputType.Time"
              @click="setInputType(DataPointInputType.Time)"
            >
              {{ $t('activities.input_types.time') }}
            </ly-button>

            <ly-button
              class="text-xs secondary w-full"
              :active="model.inputType === DataPointInputType.Range"
              @click="setInputType(DataPointInputType.Range)"
            >
              {{ $t('activities.input_types.range') }}
            </ly-button>
          </div>
          <div class="grid grid-flow-col grid-cols-2 grid-rows-2 gap-2">
            <div>
              <ly-input-number
                v-if="model.inputType === DataPointInputType.Checkbox"
                property="max"
                :min="1"
                :max="8"
              />
              <ly-input-number v-else property="max" :min="1" />
            </div>
            <div>
              <ly-input-number property="score" :mb="0" :steps="2" :max="100" :min="-100" />
            </div>
            <div>
              <ly-input-number property="min" :min="0" :max="model.max" />
            </div>
            <div>
              <ly-input-number property="optimal" :min="model.min" :max="model.max" />
            </div>
          </div>
        </div>
      </fieldset>

      <fieldset>
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
        <ly-input-textarea property="description" />
      </fieldset>
    </ly-form-model>
  </ly-modal>
</template>

<style scoped></style>
