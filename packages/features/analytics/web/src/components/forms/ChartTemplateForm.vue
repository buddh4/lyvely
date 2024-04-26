<script setup lang="ts">
import { type CreateChartModel, type UpdateChartModel } from '@lyvely/analytics-interface';
import { LyAlert, LySelect, LyTextField, useModel, LyFormModel } from '@lyvely/ui';
import { useChartTemplates } from '@/composables';
import { ref } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue: CreateChartModel | UpdateChartModel;
    embedded?: boolean;
  }>(),
  {
    embedded: false,
  },
);

const emit = defineEmits(['update:modelValue']);

const { formValue } = useModel(props.modelValue, emit);

const seriesTypeId = ref('');

const {
  seriesTypeDefinition,
  seriesConfigModel,
  seriesFormComponent,
  seriesTypeOptions,
  categoryOptions,
  validator,
} = useChartTemplates(formValue, seriesTypeId);
</script>

<template>
  <fieldset>
    <div
      :class="{
        'flex flex-col gap-2 border border-divide rounded bg-highlight dark:bg-main p-3': embedded,
      }">
      <ly-select
        v-model="formValue.category"
        required
        label="analytics.fields.category"
        :options="categoryOptions" />

      <ly-select
        v-if="formValue.category"
        v-model="seriesTypeId"
        class="shadow-lg"
        required
        label="analytics.fields.series"
        :options="seriesTypeOptions" />

      <ly-alert
        v-if="seriesTypeDefinition?.description"
        type="secondary"
        :text="seriesTypeDefinition!.description"
        text-size="xs" />

      <ly-form-model v-if="seriesConfigModel" v-model="seriesConfigModel" :validator="validator">
        <ly-text-field
          property="name"
          label="common.fields.label"
          :error="validator.getError('name')" />
      </ly-form-model>

      <component
        :is="seriesFormComponent"
        v-if="seriesFormComponent && seriesConfigModel"
        v-model="seriesConfigModel" />
    </div>
  </fieldset>
</template>

<style scoped></style>
