<script lang="ts" setup>
import { CalendarInterval } from '@lyvely/dates';
import { computed, ref } from 'vue';
import { onClickOutside } from '@vueuse/core';
import { useCalendarPlanPlanNavigation } from '../composables';
import { LyIcon, LyButton, LyAddButton } from '@lyvely/ui';

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
const header = ref(null);
onClickOutside(header, () => (showCreateButton.value = false));

function toggleContent() {
  return (collapsed.value = !isEmpty.value && !collapsed.value);
}

function open() {
  return (collapsed.value = !isEmpty.value && false);
}
</script>

<template>
  <div
    :id="headerId"
    ref="header"
    data-calendar-plan-header
    tabindex="0"
    :aria-label="$t('calendar-plan.aria.header', { time: accessibleTitle })"
    :data-count="count"
    class="calendar-plan-item calendar-plan-header-item first:rounded-t border-divide bg-shadow text-center border-b-0 border relative"
    @dragenter="open"
    @focusin="showCreateButton = true">
    <button
      v-if="showTodayIcon"
      class="today-button"
      :title="$t('calendar-plan.nav-today')"
      :aria-controls="itemsId"
      @click="switchToToday">
      <ly-icon role="button" name="today" />
    </button>

    <ly-button
      v-if="leftCaret"
      tabindex="0"
      :aria-label="$t('calendar-plan.aria.nav-back', { time: prevTitle })"
      class="switch-timing no-underline py-0"
      :aria-controls="itemsId"
      @click="decrementTiming">
      {{ leftCaret }}
    </ly-button>

    <button
      class="calendar-plan-title text-body select-none"
      :aria-controls="itemsId"
      :aria-label="accessibleTitle"
      :aria-expanded="collapsed ? 'false' : 'true'"
      @click="toggleContent">
      <span aria-hidden="true">
        {{ title }}
        <small v-if="collapsed && !isEmpty">{{ ` (${count})` }}</small>
      </span>
    </button>

    <ly-button
      v-if="rightCaret"
      tabindex="0"
      :aria-label="$t('calendar-plan.aria.nav-next', { time: nextTitle })"
      class="switch-timing no-underline py-0"
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
    :class="['p-0 border-0', { hidden: collapsed }]">
    <slot></slot>
  </div>
</template>

<style scoped>
.switch-timing {
  @apply inline shadow-md border border-gray-200 cursor-pointer;
  display: inline-block;
  width: 24px;
  border-radius: 50%;
  /*box-shadow: 1px 1px 3px 1px rgba(182, 182, 182, 0.66);
  -webkit-box-shadow: 1px 1px 3px 1px rgba(182, 182, 182, 0.66);
  -moz-box-shadow: 1px 1px 3px 1px rgba(182, 182, 182, 0.66);*/
  user-select: none;
}

.calendar-plan-entry-root ul .list-group-item:first-child {
  border-top: 0;
}

.today-button {
  position: absolute;
  left: 10px;
  float: left;
  cursor: pointer;
}

.today-button svg {
  margin-top: 3px;
  width: 20px;
  fill: var(--color-secondary);
}

.calendar-plan-item:not(.calendar-plan-header-item) {
  animation: fade-1 500ms 1;
}

@keyframes fade-1 {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
