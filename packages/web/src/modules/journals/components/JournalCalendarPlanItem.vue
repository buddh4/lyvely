<script lang="ts" setup>
import ItemCheckboxList from '@/modules/activities/components/ItemCheckboxList.vue';
import { DataPointInputType, JournalModel } from '@lyvely/common';
import { computed, onMounted, ref } from 'vue';
import { useCalendarPlanStore } from '@/modules/calendar-plan/stores/calendar-plan.store';
import CalendarPlanItem from '@/modules/calendar-plan/components/CalendarPlanItem.vue';
import { useDebounceFn } from '@vueuse/core';
import TimerState from '@/modules/calendar/components/TimerState.vue';
import ContentDropdown from '@/modules/content/components/ContentDropdown.vue';
import { useJournalPlanStore } from '../stores/journal-plan.store';
import { useCalendarPlanPlanItem } from '@/modules/calendar-plan/composables/calendar-plan-item.composable';

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
  set: (selection: number) => {
    dataPoint.value.value = selection;
    updateSelection(selection);
  },
});

const updateSelection = useDebounceFn((selection: number) => {
  journalStore.updateDataPoint(dataPoint.value, selection);
}, 600);

const inputBorderColorClass = computed(() => {
  const color = inputColorClass.value;
  return color.length ? `border-${color}` : color;
});

const inputColorClass = computed(() => {
  if (props.model.timeSeriesConfig.min && selection.value <= props.model.timeSeriesConfig.min) {
    return 'warning';
  }

  if (
    props.model.timeSeriesConfig.optimal &&
    selection.value >= props.model.timeSeriesConfig.optimal!
  ) {
    return 'success';
  }

  if (selection.value) {
    return 'info';
  }

  return '';
});

async function startTimer() {
  if (!dataPoint.value.timer?.isStarted()) {
    await useHabitPlanStore().startTimer(props.model);
  }
}

async function stopTimer() {
  if (dataPoint.value.timer?.isStarted()) {
    await useHabitPlanStore().stopTimer(props.model);
  }
}

const isPresentInterval = computed(() =>
  useCalendarPlanStore().isPresentInterval(props.model.timeSeriesConfig.interval),
);
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
      <item-checkbox-list
        v-if="model.timeSeriesConfig.inputType === DataPointInputType.Checkbox"
        v-model:selection="selection"
        :min="model.timeSeriesConfig.min"
        :max="model.timeSeriesConfig.max"
        :optimal="model.timeSeriesConfig.optimal"
        :disabled="isDisabled" />
      <ly-input-number
        v-else-if="model.timeSeriesConfig.inputType === DataPointInputType.Spinner"
        v-model="selection"
        :input-class="['calendar-plan-spinner-input text-sm bg-main', inputBorderColorClass]"
        :min="0"
        :max="model.timeSeriesConfig.max"
        :disabled="isDisabled" />
      <div
        v-else-if="model.timeSeriesConfig.inputType === DataPointInputType.Range"
        class="flex items-center gap-2">
        <span class="text-sm">{{ selection }}</span>
        <ly-input-range
          v-model="selection"
          :input-class="['calendar-plan-range-input', inputColorClass]"
          :min="0"
          :max="model.timeSeriesConfig.max"
          :disabled="isDisabled" />
      </div>
      <timer-state
        v-else-if="model.timeSeriesConfig.inputType === DataPointInputType.Time"
        :key="timer.calculateTotalSpan()"
        :model="timer"
        :min="model.timeSeriesConfig.min"
        :max="model.timeSeriesConfig.max"
        :optimal="model.timeSeriesConfig.optimal"
        :startable="isPresentInterval"
        @start="startTimer"
        @stop="stopTimer"
        @update="updateSelection" />
    </template>
  </calendar-plan-item>
</template>

<style scoped></style>
