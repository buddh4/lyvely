<script lang="ts" setup>
import ItemCheckboxList from "@/modules/activities/components/ItemCheckboxList.vue";
import { ActivityModel, ActivityType, TaskModel } from "@lyvely/common";
import {
  IMoveActivityEvent,
  useActivityStore,
} from "@/modules/activities/store/activity.store";
import { computed, onMounted, ref, toRefs } from "vue";
import { useCalendarPlanStore } from "@/modules/calendar/store";
import CalendarPlanItem from "@/modules/calendar/components/CalendarPlanItem.vue";
import { useActivityEditStore } from "@/modules/activities/store/edit-activity.store";
import { useHabitPlanStore } from "@/modules/activities/store/habit-plan.store";
import { useTaskPlanStore } from "@/modules/activities/store/task-plan.store";
import { useAccessibilityStore } from "@/modules/accessibility/stores/accessibilityStore";
import { translate } from "@/i18n";

interface IProps {
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
const isDisabled = computed(() => props.model.archived || isFuture.value);
const isTask = computed(() => props.model.type === ActivityType.Task);
const isHabit = computed(() => props.model.type === ActivityType.Habit);

const { model } = toRefs(props);

onMounted(async () => {
  await habitStore.getDataPoint(props.model);
  initialized.value = true;
});

const selection = computed({
  get: () =>
    props.model instanceof TaskModel
      ? +!!props.model.done
      : dataPoint.value.value,
  set: (selection: number) => {
    if (props.model.type === ActivityType.Habit) {
      habitStore.updateDataPoint(dataPoint.value, selection);
    } else {
      taskStore.setTaskSelection(props.model, !!selection);
    }
  },
});

function archiveEntry() {
  if (props.model.archived) {
    activityStore.unarchiveActivity(props.model);
  } else {
    activityStore.archiveActivity(props.model);
  }
}

function editEntry() {
  useActivityEditStore().setEditActivity(props.model);
}

function selectTag(tagId: string) {
  useActivityStore().filter.setOption("tagId", tagId);
}

const root = ref<InstanceType<typeof CalendarPlanItem> | null>(null);

function prepareMoveEvent(
  model: ActivityModel,
  element: HTMLElement,
  newIndex: (current: number) => number
) {
  const draggableElement = element.closest("[data-draggable]")!;
  const currentIndex = Array.from(
    draggableElement.parentNode!.children
  ).indexOf(draggableElement);

  return {
    draggable: draggableElement,
    store:
      props.model.type === ActivityType.Habit
        ? useHabitPlanStore()
        : useTaskPlanStore(),
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
  const { store, event } = prepareMoveEvent(
    model,
    element,
    (currentIndex) => currentIndex - 1
  );

  if (event.oldIndex === 0) {
    useAccessibilityStore().addMessage(
      translate("calendar.plan.aria.move-boundary")
    );
    return;
  }

  await store.move(event);
  afterMove(event);
}

async function moveDown(model: ActivityModel, element: HTMLElement) {
  const { store, event, draggable } = prepareMoveEvent(
    model,
    element,
    (currentIndex) => currentIndex + 1
  );

  if (draggable.parentNode!.children.length === event.newIndex) {
    useAccessibilityStore().addMessage(
      translate("calendar.plan.aria.move-boundary")
    );
    return;
  }

  await store.move(event);
  afterMove(event);
}

function afterMove(evt: IMoveActivityEvent) {
  setTimeout(() =>
    document
      .querySelector<HTMLElement>(`[data-cid="${evt.cid}"] .item-drag-button`)
      ?.focus()
  );
  useAccessibilityStore().addMessage(
    translate("calendar.plan.aria.move-success", {
      from: evt.oldIndex,
      to: evt.newIndex,
    })
  );
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
        <ItemCheckboxList
          v-model:selection="selection"
          :max="1"
          :is-task="true"
          :disabled="isDisabled"
        />
      </div>
    </template>

    <template v-if="isHabit" #rating>
      <ItemCheckboxList
        v-model:selection="selection"
        :min="model.dataPointConfig.min"
        :max="model.dataPointConfig.max"
        :optimal="model.dataPointConfig.optimal"
        :disabled="isDisabled"
      />
    </template>
  </CalendarPlanItem>
</template>

<style scoped></style>
