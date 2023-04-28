<script lang="ts" setup>
import { TaskModel } from '@lyvely/common';
import ContentDetails from '@/modules/content-stream/components/ContentDetails.vue';
import LyInputCheckbox from '@/modules/ui/components/form/CheckboxInput.vue';
import LyButton from '@/modules/ui/components/button/StyledButton.vue';
import LyIcon from '@/modules/ui/components/icon/UIIcon.vue';
import { computed } from 'vue';
import { useTaskCalendarPlanStore } from '@/modules/tasks/stores/task-calendar-plan.store';

export interface IProps {
  model: TaskModel;
}

const props = defineProps<IProps>();

const isDone = computed(() => props.model.done);

const taskStore = useTaskCalendarPlanStore();

const closeTask = () => taskStore.setTaskSelection(props.model, true);
const openTask = () => taskStore.setTaskSelection(props.model, false);
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
    </template>
    <template #footer>
      <div class="flex justify-end">
        <ly-button v-if="isDone" class="secondary outlined text-xs" @click="openTask">
          <ly-icon name="loop" class="text-main-light w-3.5 h-3.5" />
          {{ $t('tasks.buttons.open') }}
        </ly-button>
        <ly-button
          v-else
          class="secondary outlined text-xs inline-flex items-center gap-1"
          @click="closeTask">
          <ly-icon name="check" class="text-main-light w-3.5 h-3.5" />
          {{ $t('tasks.buttons.close') }}
        </ly-button>
      </div>
    </template>
  </content-details>
</template>

<style scoped></style>
