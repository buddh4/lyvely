<script setup lang="ts">
import { type CreateChartModel, type UpdateChartModel } from '@lyvely/analytics-interface';
import { LyAlert, LySelect, LyFormModel, LyTextField, useModel } from '@lyvely/ui';
import { useChartTemplates } from '@/composables';
import { ref } from 'vue';

const props = withDefaults(
  defineProps<{
    isCreate?: boolean;
    modelValue: CreateChartModel | UpdateChartModel;
    embedded?: boolean;
    category?: string;
  }>(),
  {
    isCreate: true,
    embedded: false,
    category: undefined,
  },
);

const emit = defineEmits(['update:modelValue']);

const { formValue } = useModel(props.modelValue, emit);

const seriesTypeId = ref(formValue.value.series?.type || '');

const {
  validator,
  seriesTypeDefinition,
  seriesConfigModel,
  seriesFormComponent,
  seriesTypeOptions,
  categoryOptions,
} = useChartTemplates(formValue, seriesTypeId, props.category);
</script>

<template>
  <fieldset>
    <div
      :class="{
        'flex flex-col gap-2 border border-divide rounded bg-highlight dark:bg-main p-3': embedded,
      }">
      <ly-form-model v-if="seriesConfigModel" v-model="seriesConfigModel" :validator="validator">
        <ly-text-field
          property="name"
          label="analytics.fields.series-name"
          :error="validator.getError('name')" />
      </ly-form-model>

      <ly-select
        v-if="isCreate && categoryOptions.length > 1"
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

      <component
        :is="seriesFormComponent"
        v-if="seriesFormComponent && seriesConfigModel"
        v-model="seriesConfigModel" />
    </div>
  </fieldset>
</template>

<style scoped></style>
