<script setup lang="ts">
import { UserScoreSeriesConfigModel } from '@lyvely/analytics-interface';
import { I18nModelValidator, ProfileRelationPicker, TagPicker } from '@lyvely/web';
import { LyFormModel, LyCheckbox, useModel } from '@lyvely/ui';
import { computed } from 'vue';
import TimeSeriesChartTypeSelection from '@/components/forms/TimeSeriesChartTypeSelection.vue';

const props = defineProps<{
  modelValue: UserScoreSeriesConfigModel<string>;
}>();

const emit = defineEmits(['update:modelValue']);

const { formValue } = useModel(props.modelValue!, emit);

const validator = computed(() => new I18nModelValidator(formValue.value));
</script>

<template>
  <div>
    <ly-form-model v-model="formValue" :validator="validator">
      <time-series-chart-type-selection v-model="formValue.chartType" />
      <profile-relation-picker v-model="formValue.uids" label="analytics.fields.users" />
      <tag-picker v-model="formValue.tagIds" label="analytics.fields.tags" />
      <ly-checkbox v-model="formValue.currentUser" label="analytics.fields.current-user" />
    </ly-form-model>
  </div>
</template>

<style scoped></style>
