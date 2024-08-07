<script lang="ts" setup>
import { CalendarInterval } from '@lyvely/dates';
import { t } from '@lyvely/web';
import { computed, ref } from 'vue';
import { onClickOutside } from '@vueuse/core';
import { useCalendarPlanPlanNavigation } from '../composables';
import { LyAddButton, LyButton, LyIcon } from '@lyvely/ui';

export interface IProps {
  interval: CalendarInterval;
  createButtonTitle: string;
  count: number;
}

defineEmits(['create']);
const props = defineProps<IProps>();

const {
  title,
  accessibleTitle,
  showTodayIcon,
  rightCaret,
  leftCaret,
  nextTitle,
  prevTitle,
  label,
  incrementTiming,
  decrementTiming,
  switchToToday,
} = useCalendarPlanPlanNavigation(props.interval);

const collapsed = ref(false);
const isEmpty = computed(() => !props.count);

/**
 * In case of weekly title we use the locale of the profile, since the profile may use another week format
 * TODO: (week of day) make this configurable in profile independently of locale
 */

const headerId = `calendar-plan-${label}`;
const itemsId = `calendar-plan-items-${label}`;

const showCreateButton = ref(false);
const header = ref();
onClickOutside(header, () => (showCreateButton.value = false));

function toggleContent() {
  return (collapsed.value = !isEmpty.value && !collapsed.value);
}

function open() {
  return (collapsed.value = !isEmpty.value && false);
}

// Unscheduled is the last section and needs some style alignments.
const isEmptyUnscheduled = computed(
  () => props.interval === CalendarInterval.Unscheduled && props.count === 0
);
</script>

<template>
  <div
    ref="header"
    :data-id="headerId"
    tabindex="0"
    :aria-label="t('calendar-plan.aria.header', { time: accessibleTitle })"
    :data-count="count"
    :class="[
      'relative bg-shadow px-3 py-2 text-center',
      'border border-divide first:rounded-t ',
      { 'border-b-0': !isEmptyUnscheduled },
      { 'rounded-b border-b': isEmptyUnscheduled },
    ]"
    @dragenter="open"
    @focusin="showCreateButton = true">
    <button
      v-if="showTodayIcon"
      type="button"
      class="today-button absolute left-2.5"
      :title="t('calendar-plan.nav-today')"
      :aria-controls="itemsId"
      @click="switchToToday">
      <ly-icon role="button" name="today" />
    </button>

    <ly-button
      v-if="leftCaret"
      tabindex="0"
      :aria-label="t('calendar-plan.aria.nav-back', { time: prevTitle })"
      class="inline-block select-none py-0"
      :aria-controls="itemsId"
      @click="decrementTiming">
      {{ leftCaret }}
    </ly-button>

    <button
      class="text-body my-0 inline-block cursor-pointer select-none"
      type="button"
      :aria-controls="itemsId"
      :aria-label="accessibleTitle"
      :aria-expanded="collapsed ? 'false' : 'true'"
      style="min-width: 110px"
      @click="toggleContent">
      <span aria-hidden="true">
        {{ title }}
        <small v-if="collapsed && !isEmpty">{{ ` (${count})` }}</small>
      </span>
    </button>

    <ly-button
      v-if="rightCaret"
      tabindex="0"
      :aria-label="t('calendar-plan.aria.nav-next', { time: nextTitle })"
      class="inline-block select-none py-0"
      :aria-controls="itemsId"
      @click="incrementTiming">
      {{ rightCaret }}
    </ly-button>

    <ly-add-button
      v-if="showCreateButton"
      class="absolute right-2"
      :title="createButtonTitle"
      @click="
        showCreateButton = false;
        $emit('create');
      ">
      +
    </ly-add-button>
  </div>

  <div
    :id="itemsId"
    role="list"
    data-calendar-plan-item-container
    :class="[
      'border-x border-divide bg-main p-0',
      { 'last:rounded-b last:border-b': count !== 0 },
      { hidden: collapsed },
    ]">
    <slot></slot>
  </div>
</template>

<style scoped></style>
