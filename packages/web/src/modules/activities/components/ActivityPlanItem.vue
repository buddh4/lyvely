<script lang="ts" setup>
import ItemCheckboxList from '@/modules/activities/components/ItemCheckboxList.vue';
import { ActivityType, TaskModel, ActivityModel, DataPointInputType, secondsToTime, formatTime } from '@lyvely/common';
import { IMoveActivityEvent, useActivityStore } from '@/modules/activities/store/activity.store';
import { computed, onMounted, ref, toRefs } from 'vue';
import { useCalendarPlanStore } from '@/modules/calendar/store';
import CalendarPlanItem from '@/modules/calendar/components/CalendarPlanItem.vue';
import { useUpdateActivityStore } from '@/modules/activities/store/update-activity.store';
import { useHabitPlanStore } from '@/modules/activities/store/habit-plan.store';
import { useTaskPlanStore } from '@/modules/activities/store/task-plan.store';
import { useAccessibilityStore } from '@/modules/accessibility/stores/accessibility.store';
import { translate } from '@/i18n';
import { useDebounceFn } from '@vueuse/core';

export interface IProps {
  model: ActivityModel;
}

const props = defineProps<IProps>();
const initialized = ref(false);
const activityStore = useActivityStore();
const habitStore = useHabitPlanStore();
const taskStore = useTaskPlanStore();
const calendarPlanStore = useCalendarPlanStore();
const dataPoint = computed(() => habitStore.getDataPoint(props.model));

const isFuture = computed(() => calendarPlanStore.date > new Date());
const isDisabled = computed(() => props.model.meta.isArchived || isFuture.value);
const isTask = computed(() => props.model.type === ActivityType.Task);
const isHabit = computed(() => props.model.type === ActivityType.Habit);

const { model } = toRefs(props);

onMounted(async () => {
  await habitStore.getDataPoint(props.model);
  initialized.value = true;
});

const updateSelection = useDebounceFn((selection: number) => {
  habitStore.updateDataPoint(dataPoint.value, selection);
}, 600);

const selection = computed({
  get: () => (props.model instanceof TaskModel ? +!!props.model.done : dataPoint.value.value),
  set: (selection: number) => {
    if (props.model.type === ActivityType.Habit) {
      dataPoint.value.value = selection;
      updateSelection(selection);
    } else {
      taskStore.setTaskSelection(props.model, !!selection);
    }
  },
});

function archiveEntry() {
  if (props.model.meta.isArchived) {
    activityStore.unarchiveActivity(props.model);
  } else {
    activityStore.archiveActivity(props.model);
  }
}

function editEntry() {
  useUpdateActivityStore().setEditActivity(props.model);
}

function selectTag(tagId: string) {
  useActivityStore().filter.setOption('tagId', tagId);
}

const root = ref<InstanceType<typeof CalendarPlanItem> | null>(null);

function prepareMoveEvent(model: ActivityModel, element: HTMLElement, newIndex: (current: number) => number) {
  const draggableElement = element.closest('[data-draggable]')!;
  const currentIndex = Array.from(draggableElement.parentNode!.children).indexOf(draggableElement);

  return {
    draggable: draggableElement,
    store: props.model.type === ActivityType.Habit ? useHabitPlanStore() : useTaskPlanStore(),
    event: {
      cid: model.id,
      fromInterval: model.dataPointConfig.interval,
      toInterval: model.dataPointConfig.interval,
      oldIndex: currentIndex,
      newIndex: newIndex(currentIndex),
    },
  };
}

async function moveUp(model: ActivityModel, element: HTMLElement) {
  const { store, event } = prepareMoveEvent(model, element, (currentIndex) => currentIndex - 1);

  if (event.oldIndex === 0) {
    useAccessibilityStore().addMessage(translate('calendar.plan.aria.move-boundary'));
    return;
  }

  await store.move(event);
  afterMove(event);
}

async function moveDown(model: ActivityModel, element: HTMLElement) {
  const { store, event, draggable } = prepareMoveEvent(model, element, (currentIndex) => currentIndex + 1);

  if (draggable.parentNode!.children.length === event.newIndex) {
    useAccessibilityStore().addMessage(translate('calendar.plan.aria.move-boundary'));
    return;
  }

  await store.move(event);
  afterMove(event);
}

function afterMove(evt: IMoveActivityEvent) {
  setTimeout(() => document.querySelector<HTMLElement>(`[data-cid="${evt.cid}"] .item-drag-button`)?.focus());
  useAccessibilityStore().addMessage(
    translate('calendar.plan.aria.move-success', {
      from: evt.oldIndex,
      to: evt.newIndex,
    }),
  );
}

const min = computed(() => model.value.dataPointConfig.min || 1);
const max = computed(() => model.value.dataPointConfig.max || 1);
const optimal = computed(() => model.value.dataPointConfig.optimal);

const inputBorderColorClass = computed(() => {
  if (model.value?.dataPointConfig.min && selection.value <= model.value.dataPointConfig.min) {
    return 'border-warning';
  }

  if (model.value?.dataPointConfig.optimal && selection.value >= model.value.dataPointConfig.optimal!) {
    return 'border-success';
  }

  if (selection.value) {
    return 'border-info';
  }

  return '';
});

const inputColorClass = computed(() => {
  if (model.value?.dataPointConfig.min && selection.value <= model.value.dataPointConfig.min) {
    return 'warning';
  }

  if (model.value?.dataPointConfig.optimal && selection.value >= model.value.dataPointConfig.optimal!) {
    return 'success';
  }

  if (selection.value) {
    return 'info';
  }

  return '';
});

const t = ref(0);
const timerActive = ref(false);

const timeValue = computed(() => {
  return formatTime(secondsToTime(t.value));
});

let timerInterval: ReturnType<typeof setInterval>;
function startTimer() {
  timerActive.value = true;
  timerInterval = setInterval(() => {
    t.value += 1;
  }, 1000);
}

function stopTimer() {
  timerActive.value = false;
  clearInterval(timerInterval);
}
//TODO: Maybe implement move to next interval with Ctrl + Left/Right
</script>

<template>
  <CalendarPlanItem
    v-if="initialized"
    ref="root"
    :model="model"
    @archive="archiveEntry"
    @edit="editEntry"
    @move-up="moveUp"
    @move-down="moveDown"
    @select-tag="selectTag"
  >
    <template v-if="isTask" #pre-title>
      <div class="mr-1 mt-1 mr-2">
        <ItemCheckboxList v-model:selection="selection" :max="1" :is-task="true" :disabled="isDisabled" />
      </div>
    </template>

    <template v-if="isHabit" #rating>
      <ItemCheckboxList
        v-if="model.dataPointConfig.inputType === DataPointInputType.Checkbox"
        v-model:selection="selection"
        :min="min"
        :max="max"
        :optimal="optimal"
        :disabled="isDisabled"
      />
      <ly-input-number
        v-else-if="model.dataPointConfig.inputType === DataPointInputType.Spinner"
        v-model="selection"
        :input-class="['spinner-input text-sm', inputBorderColorClass]"
        :min="0"
        :max="max"
        :disabled="isDisabled"
      />
      <div v-else-if="model.dataPointConfig.inputType === DataPointInputType.Range" class="flex items-center gap-2">
        <span class="text-sm">{{ selection }}</span>
        <ly-input-range
          v-model="selection"
          :input-class="['range-input', inputColorClass]"
          :min="0"
          :max="max"
          :disabled="isDisabled"
        />
      </div>
      <div v-else-if="model.dataPointConfig.inputType === DataPointInputType.Time" class="flex items-center gap-2">
        <span class="text-sm">{{ timeValue }}</span>
        <ly-button
          v-if="!timerActive"
          class="w-5 h-5 bg-main border border-main rounded-full flex justify-center items-center text-sm px-0 py-0"
          @click="startTimer"
        >
          <ly-icon name="play" class="w-3 text-primary" />
        </ly-button>
        <ly-button
          v-else
          class="w-5 h-5 bg-main border border-main rounded-full flex justify-center items-center text-sm px-0 py-0"
          @click="stopTimer"
        >
          <ly-icon name="stop" class="w-3 text-danger" />
        </ly-button>
      </div>
    </template>
  </CalendarPlanItem>
</template>

<style>
.spinner-input {
  max-width: 130px;
  float: right;
  clear: both;
}

.range-input {
  max-width: 130px;
  direction: rtl;
  float: right;
  clear: both;
}
</style>
