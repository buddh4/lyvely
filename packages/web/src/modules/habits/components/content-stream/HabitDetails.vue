<script lang="ts" setup>
import { HabitModel, isNumberDataPointConfig, isTimerDataPointConfig } from '@lyvely/common';
import ContentDetails from '@/modules/content-stream/components/ContentDetails.vue';
import CalendarPlanNumberInput from '@/modules/calendar-plan/components/inputs/CalendarPlanNumberInput.vue';
import CalendarPlanTimerInput from '@/modules/calendar-plan/components/inputs/CalendarPlanTimerInput.vue';
import { useHabitCalendarPlanStore } from '@/modules/habits/stores/habit-calendar-plan.store';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import {
  useCalendarPlanPlanItem,
  useCalendarPlanPlanNavigation,
  useCalendarPlanStore,
} from '@/modules/calendar-plan';
import { useUpdateHabit } from '@/modules/habits/composables';
import TimeSeriesSummary from '@/modules/time-series/components/TimeSeriesSummary.vue';

export interface IProps {
  model: HabitModel;
}

const props = defineProps<IProps>();

const habitStore = useHabitCalendarPlanStore();
const initialized = ref(false);
const { getDataPoint, loadModel } = habitStore;
const { isDisabled } = useCalendarPlanPlanItem(props.model, habitStore);
const { selection, startTimer, stopTimer, timer } = useUpdateHabit(props.model);
const {
  title,
  accessibleTitle,
  rightCaret,
  leftCaret,
  nextTitle,
  prevTitle,
  incrementTiming,
  decrementTiming,
  showTodayIcon,
  switchToToday,
  label,
  date,
} = useCalendarPlanPlanNavigation(props.model.interval);

const unwatchDate = watch(date, () => loadModel(props.model.id));

onMounted(async () => {
  useCalendarPlanStore().switchToToday();
  await loadModel(props.model.id);
  await getDataPoint(props.model);
  initialized.value = true;
});

onUnmounted(unwatchDate);
</script>

<template>
  <content-details :model="model">
    <template #image>
      <div class="flex justify-center rounded-full border border-divide w-8 h-8 bg-main">
        <router-link :to="{ name: 'Habits' }">
          <ly-icon name="activity" class="text-main" />
        </router-link>
      </div>
    </template>
    <template #body>
      <div>
        {{ model.content.text }}
      </div>
      <div>
        <time-series-summary
          class="mt-4"
          :summary="model.timeSeriesSummary"
          :interval="model.interval" />
      </div>
    </template>
    <template #footer>
      <div v-if="initialized" class="flex flex-col items-center">
        <div class="flex">
          <ly-button
            v-if="leftCaret"
            tabindex="0"
            :aria-label="$t('calendar.plan.aria.nav-back', { time: prevTitle })"
            class="switch-timing no-underline py-0"
            @click="decrementTiming">
            {{ leftCaret }}
          </ly-button>

          <button class="text-xs font-bold text-body select-none" :aria-label="accessibleTitle">
            <span aria-hidden="true">
              {{ title }}
            </span>
          </button>

          <ly-button
            v-if="rightCaret"
            tabindex="0"
            :aria-label="$t('calendar.plan.aria.nav-next', { time: nextTitle })"
            class="switch-timing no-underline py-0"
            @click="incrementTiming">
            {{ rightCaret }}
          </ly-button>
        </div>
        <div>
          <calendar-plan-number-input
            v-if="isNumberDataPointConfig(model.timeSeriesConfig)"
            v-model="selection"
            :disabled="isDisabled"
            :config="model.timeSeriesConfig" />
          <calendar-plan-timer-input
            v-else-if="isTimerDataPointConfig(model.timeSeriesConfig)"
            v-model="selection"
            :config="model.timeSeriesConfig"
            :timer="timer"
            :disabled="isDisabled"
            @start-timer="startTimer"
            @stop-timer="stopTimer" />
        </div>
        <div>
          <button
            v-if="showTodayIcon"
            class="today-button"
            :title="$t('calendar.plan.nav-today')"
            @click="switchToToday">
            <ly-icon role="button" name="today" />
          </button>
        </div>
      </div>
    </template>
  </content-details>
</template>

<style scoped>
.today-button {
  left: 10px;
  float: left;
  cursor: pointer;
}
</style>
