<script lang="ts" setup>
import {
  isNumberDataPointConfig,
  isTextDataPointConfig,
  isSelectionDataPointConfig,
  TimeSeriesNumberInput,
  TimeSeriesSelectionInput,
} from '@lyvely/time-series-web';
import { JournalModel } from '@lyvely/journals-interface';
import { computed, onMounted, ref } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import { ContentDropdown, t } from '@lyvely/web';
import { LyEditableText } from '@lyvely/ui';
import { useJournalPlanStore } from '@/stores';
import {
  useCalendarPlanItem,
  CalendarPlanItem,
  useCalendarPlanItemSort,
} from '@lyvely/calendar-plan-web';

export interface IProps {
  model: JournalModel;
}

const props = defineProps<IProps>();
const initialized = ref(false);
const journalStore = useJournalPlanStore();

const { isDisabled } = useCalendarPlanItem(props.model);
const { moveUp, moveDown } = useCalendarPlanItemSort(props.model, journalStore);
const { selectTag } = journalStore;

const dataPoint = computed(() => journalStore.getDataPoint(props.model));

onMounted(async () => {
  await journalStore.getDataPoint(props.model);
  initialized.value = true;
});

const selection = computed({
  get: () => dataPoint.value!.value,
  set: (selection: any) => {
    dataPoint.value!.value = selection;
    updateSelection(selection);
  },
});

const updateSelection = useDebounceFn((selection: any) => {
  journalStore.updateDataPoint(dataPoint.value!, selection);
}, 600);
</script>

<template>
  <calendar-plan-item
    v-if="initialized"
    :model="model"
    @move-up="moveUp"
    @move-down="moveDown"
    @select-tag="selectTag">
    <template #menu>
      <content-dropdown :content="model" />
    </template>
    <template #rating>
      <time-series-number-input
        v-if="isNumberDataPointConfig(model.timeSeriesConfig)"
        v-model="selection"
        :config="model.timeSeriesConfig"
        :disabled="isDisabled" />
    </template>
    <template #body>
      <div v-if="isTextDataPointConfig(model.timeSeriesConfig)">
        <ly-editable-text
          v-model="selection"
          class="pt-2 text-sm"
          :placeholder="t('journals.plan.text.placeholder')" />
      </div>
      <div v-else-if="isSelectionDataPointConfig(model.timeSeriesConfig)">
        <time-series-selection-input
          v-model="selection"
          :config="model.timeSeriesConfig"
          :disabled="isDisabled" />
      </div>
    </template>
  </calendar-plan-item>
</template>

<style scoped></style>
