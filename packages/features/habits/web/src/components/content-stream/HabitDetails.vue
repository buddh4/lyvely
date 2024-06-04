<script lang="ts" setup>
import { HabitModel } from '@lyvely/habits-interface';
import {
  isNumberDataPointConfig,
  isTimerDataPointConfig,
  TimeSeriesNumberInput,
  TimeSeriesTimerInput,
  TimeSeriesSummary,
} from '@lyvely/time-series-web';
import { ContentDetails, t } from '@lyvely/web';
import { useHabitCalendarPlanStore } from '@/stores';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import {
  useCalendarPlanItem,
  useCalendarPlanPlanNavigation,
  useCalendarPlanStore,
} from '@lyvely/calendar-plan-web';
import { useUpdateHabit } from '@/composables';
import { LyIcon, LyButton, LyMarkdownView } from '@lyvely/ui';

export interface IProps {
  model: HabitModel;
}

const props = defineProps<IProps>();

const habitStore = useHabitCalendarPlanStore();
const initialized = ref(false);
const { getDataPoint, loadModel } = habitStore;
const { isDisabled } = useCalendarPlanItem(props.model, habitStore);
const { selection, startTimer, stopTimer, timer, isTimerStartable } = useUpdateHabit(props.model);
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
  date,
} = useCalendarPlanPlanNavigation(props.model.interval);

const timerSelection = <any>selection;

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
      <div class="flex h-8 w-8 justify-center rounded-full border border-divide bg-main">
        <router-link :to="{ name: 'Habits' }">
          <ly-icon name="activity" class="text-main" />
        </router-link>
      </div>
    </template>
    <template #body>
      <div v-if="model.content.text?.length" class="mb-4">
        <ly-markdown-view :md="model.content.text" class="text-sm" />
      </div>
      <div>
        <time-series-summary
          class="mt-4"
          :value-type="model.timeSeriesConfig.valueType"
          :summary="model.timeSeriesSummary"
          :interval="model.interval"
          height="200px" />
      </div>
    </template>
    <template #footer>
      <div v-if="initialized" class="flex flex-col items-center">
        <div class="flex">
          <ly-button
            v-if="leftCaret"
            tabindex="0"
            :aria-label="t('calendar-plan.aria.nav-back', { time: prevTitle })"
            class="switch-timing py-0 no-underline"
            @click="decrementTiming">
            {{ leftCaret }}
          </ly-button>

          <button
            type="button"
            class="text-body select-none text-xs font-bold"
            :aria-label="accessibleTitle">
            <span aria-hidden="true">
              {{ title }}
            </span>
          </button>

          <ly-button
            v-if="rightCaret"
            tabindex="0"
            :aria-label="t('calendar-plan.aria.nav-next', { time: nextTitle })"
            class="switch-timing py-0 no-underline"
            @click="incrementTiming">
            {{ rightCaret }}
          </ly-button>
        </div>
        <div>
          <time-series-number-input
            v-if="isNumberDataPointConfig(model.timeSeriesConfig)"
            v-model="selection"
            :disabled="isDisabled"
            :config="model.timeSeriesConfig" />
          <time-series-timer-input
            v-else-if="isTimerDataPointConfig(model.timeSeriesConfig)"
            v-model="timerSelection"
            :config="model.timeSeriesConfig"
            :timer="timer"
            :startable="isTimerStartable"
            :disabled="isDisabled"
            @start-timer="startTimer"
            @stop-timer="stopTimer" />
        </div>
        <div>
          <button
            v-if="showTodayIcon"
            type="button"
            :title="t('calendar-plan.nav-today')"
            @click="switchToToday">
            <ly-icon role="button" name="today" />
          </button>
        </div>
      </div>
    </template>
  </content-details>
</template>

<style scoped></style>
