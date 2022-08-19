<script lang="ts" setup>
import ItemCheckboxList from "@/modules/activity/components/ItemCheckboxList.vue";
import { IActivity, ActivityType , TaskDto } from '@lyvely/common';
import { useActivityStore } from '@/modules/activity/store/activityStore';
import { computed, onMounted, ref, toRefs } from 'vue';
import { useTimingStore } from '@/modules/calendar/store';
import TimingListEntry from "@/modules/calendar/components/TimingListEntry.vue";
import { useActivityEditStore } from '@/modules/activity/store/editActivityStore';
import { useHabitPlanStore } from "@/modules/activity/store/habitPlanStore";
import { useTaskPlanStore } from "@/modules/activity/store/taskPlanStore";

interface Props {
  model: IActivity
}

const props = defineProps<Props>();
const initialized = ref(false);
const activityStore = useActivityStore();
const habitStore = useHabitPlanStore();
const taskStore = useTaskPlanStore();
const timingStore = useTimingStore();
const dataPoint = computed(() => habitStore.getDataPoint(props.model));

onMounted(async () => {
  await habitStore.getDataPoint(props.model);
  initialized.value = true;
});

const selection = computed({
  get: () => (props.model instanceof TaskDto) ? +!!props.model.done : dataPoint.value.value,
  set: (selection: number) => {
    if(props.model.type === ActivityType.Habit) {
      habitStore.updateDataPoint(dataPoint.value, selection)
    } else {
      taskStore.setTaskSelection(props.model, !!selection);
    }
  }
})

function archiveEntry() {
  if(props.model.archived) {
    activityStore.unarchiveActivity(props.model);
  } else {
    activityStore.archiveActivity(props.model);
  }
}

function editEntry() {
  useActivityEditStore().setEditActivity(props.model);
}

const isFuture = computed(() => timingStore.date > new Date());
const isDisabled = computed(() => props.model.archived || isFuture.value);
const isTask = computed(() => props.model.type === ActivityType.Task);
const isHabit = computed(() => props.model.type === ActivityType.Habit);

const { model } = toRefs(props);
</script>

<template>
  <TimingListEntry v-if="initialized" :model="model" @archive="archiveEntry" @edit="editEntry">

    <template v-if="isTask" #pre-title>
      <div class="mr-1 mt-1 mr-2">
        <ItemCheckboxList v-model:selection="selection" :max="1" :is-task="true" :disabled="isDisabled"/>
      </div>
    </template>

    <template v-if="isHabit" #rating>
      <ItemCheckboxList
          v-model:selection="selection"
          :min="model.dataPointConfig.min"
          :max="model.dataPointConfig.max"
          :optimal="model.dataPointConfig.optimal"
          :disabled="isDisabled"/>
    </template>

  </TimingListEntry>
</template>

<style scoped></style>
