<script lang="ts" setup>
import { TaskModel } from '@lyvely/tasks-interface';
import { computed } from 'vue';
import { useTaskCalendarPlanStore } from '@/stores';
import { TimerState, ContentDetails, t } from '@lyvely/web';
import { LyIcon, LyButton, LyMarkdownView } from '@lyvely/ui';
import { useCalendarPlanItem } from '@lyvely/calendar-plan-web';

export interface IProps {
  model: TaskModel;
}

const props = defineProps<IProps>();

const isDone = computed(() => props.model.state.done);

const taskStore = useTaskCalendarPlanStore();

const { isDisabled } = useCalendarPlanItem(props.model);

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
          'flex h-8 w-8 justify-center rounded-full border bg-main',
          isDone ? 'border-success' : 'border-divide',
        ]">
        <router-link :to="{ name: 'Tasks' }">
          <ly-icon name="task" :class="isDone ? 'text-success' : 'text-main'" />
        </router-link>
      </div>
    </template>
    <template #body>
      <div v-if="model.content.text?.length" class="mb-2 text-sm">
        <ly-markdown-view :md="model.content.text" class="text-sm" />
      </div>
      <div class="flex justify-end">
        <timer-state
          :key="model.state.timer.calculateTotalSpan()"
          :startable="!isDisabled"
          :model="model.state.timer"
          :show-time-on-init="!!model.state.done"
          @start="startTimer"
          @stop="stopTimer"
          @update="updateTimer" />
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end">
        <ly-button
          v-if="isDone && model.policies.canWrite"
          class="secondary outlined text-xs"
          @click="openTask">
          <ly-icon name="loop" class="text-main-light h-3.5 w-3.5" />
          {{ t('tasks.buttons.open') }}
        </ly-button>
        <ly-button
          v-else-if="model.policies.canWrite"
          class="secondary outlined inline-flex items-center gap-1 text-xs"
          @click="closeTask">
          <ly-icon name="check" class="text-main-light h-3.5 w-3.5" />
          {{ t('tasks.buttons.close') }}
        </ly-button>
        <div
          v-else-if="model.state.done"
          class="rounded border border-success px-2.5 py-1.5 text-sm text-success">
          <ly-icon name="check" class="text-main-light h-3.5 w-3.5" />
          {{ t('tasks.state.done') }}
        </div>
        <div v-else class="rounded border border-warning px-2.5 py-1.5 text-sm text-warning">
          <ly-icon name="loop" class="text-main-light h-3.5 w-3.5" />
          {{ t('tasks.state.undone') }}
        </div>
      </div>
    </template>
  </content-details>
</template>

<style scoped></style>
