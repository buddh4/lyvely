<script lang="ts" setup>
import {
  isNumberDataPointConfig,
  isTextDataPointConfig,
  isSelectionDataPointConfig,
} from '@lyvely/time-series-interface';
import { JournalModel } from '@lyvely/journals-interface';
import { computed, onMounted, ref } from 'vue';
import CalendarPlanItem from '@/modules/calendar-plan/components/CalendarPlanItem.vue';
import CalendarPlanNumberInput from '@/modules/calendar-plan/components/inputs/CalendarPlanNumberInput.vue';
import { useDebounceFn } from '@vueuse/core';
import ContentDropdown from '@/modules/content/components/ContentDropdown.vue';
import { useJournalPlanStore } from '@/modules/journals/stores/journal-calendar-plan.store';
import { useCalendarPlanPlanItem } from '@/modules/calendar-plan/composables/calendar-plan-item.composable';
import CalendarPlanSelectionInput from '@/modules/calendar-plan/components/inputs/CalendarPlanSelectionInput.vue';

export interface IProps {
  model: JournalModel;
}

const props = defineProps<IProps>();
const initialized = ref(false);
const journalStore = useJournalPlanStore();

const { isDisabled, moveUp, moveDown } = useCalendarPlanPlanItem(props.model, journalStore);
const { selectTag } = journalStore;

const dataPoint = computed(() => journalStore.getDataPoint(props.model));

onMounted(async () => {
  await journalStore.getDataPoint(props.model);
  initialized.value = true;
});

const selection = computed({
  get: () => dataPoint.value.value,
  set: (selection: any) => {
    dataPoint.value.value = selection;
    updateSelection(selection);
  },
});

const updateSelection = useDebounceFn((selection: any) => {
  journalStore.updateDataPoint(dataPoint.value, selection);
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
      <calendar-plan-number-input
        v-if="isNumberDataPointConfig(model.timeSeriesConfig)"
        v-model="selection"
        :config="model.timeSeriesConfig"
        :disabled="isDisabled" />
    </template>
    <template #body>
      <div v-if="isTextDataPointConfig(model.timeSeriesConfig)">
        <ly-editable-text
          v-model="selection"
          class="text-sm pt-2"
          :placeholder="$t('journals.plan.text.placeholder')" />
      </div>
      <div v-else-if="isSelectionDataPointConfig(model.timeSeriesConfig)">
        <calendar-plan-selection-input
          v-model="selection"
          :config="model.timeSeriesConfig"
          :disabled="isDisabled" />
      </div>
    </template>
  </calendar-plan-item>
</template>

<style scoped></style>
