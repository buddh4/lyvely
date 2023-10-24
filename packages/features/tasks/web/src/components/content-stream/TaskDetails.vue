<script lang="ts" setup>
import { TaskModel } from '@lyvely/tasks-interface';
import { computed } from 'vue';
import { useTaskCalendarPlanStore } from '@/stores';
import { TimerState, ContentDetails, t } from '@lyvely/web';
import { LyIcon, LyButton } from '@lyvely/ui';

export interface IProps {
  model: TaskModel;
}

const props = defineProps<IProps>();

const isDone = computed(() => props.model.done);

const taskStore = useTaskCalendarPlanStore();

const closeTask = () => taskStore.setTaskSelection(props.model, true);
const openTask = () => taskStore.setTaskSelection(props.model, false);

const startTimer = async () => taskStore.startTimer(props.model);
const stopTimer = async () => taskStore.stopTimer(props.model);
const updateTimer = async (value: number) => taskStore.updateTimer(props.model, value);
</script>

<template>
  <content-details :model="model">
    <template #image>
      <div
        :class="[
          'flex justify-center rounded-full w-8 h-8 bg-main border',
          isDone ? 'border-success' : 'border-divide',
        ]">
        <router-link :to="{ name: 'Tasks' }">
          <ly-icon name="task" :class="isDone ? 'text-success' : 'text-main'" />
        </router-link>
      </div>
    </template>
    <template #body>
      <div v-if="model.content.text?.length" class="text-sm mb-2">
        {{ model.content.text }}
      </div>
      <div class="flex justify-end">
        <timer-state
          :key="model.timer.calculateTotalSpan()"
          :startable="!model.done"
          :model="model.timer"
          :show-time-on-init="!!model.done"
          @start="startTimer"
          @stop="stopTimer"
          @update="updateTimer" />
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end">
        <ly-button v-if="isDone" class="secondary outlined text-xs" @click="openTask">
          <ly-icon name="loop" class="text-main-light w-3.5 h-3.5" />
          {{ t('tasks.buttons.open') }}
        </ly-button>
        <ly-button
          v-else
          class="secondary outlined text-xs inline-flex items-center gap-1"
          @click="closeTask">
          <ly-icon name="check" class="text-main-light w-3.5 h-3.5" />
          {{ t('tasks.buttons.close') }}
        </ly-button>
      </div>
    </template>
  </content-details>
</template>

<style scoped></style>
