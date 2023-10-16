<script lang="ts" setup>
import { ITextDataPointSettings } from '@lyvely/time-series-interface';
import { computed } from 'vue';
import { LyCheckbox } from '@lyvely/ui';

interface IProps {
  modelValue: Partial<ITextDataPointSettings>;
}

const props = defineProps<IProps>();

const isRequired = computed({
  get: () => props.modelValue.required as boolean,
  // eslint-disable-next-line vue/no-mutating-props
  set: (required: boolean) => (props.modelValue.required = required),
});
</script>

<template>
  <div class="flex flex-col gap-2 border border-divide rounded bg-highlight dark:bg-main p-3">
    <div class="text-xs">
      <ly-checkbox v-model="isRequired" label="calendar-plan.fields.required" />
    </div>
  </div>
</template>

<style scoped></style>
