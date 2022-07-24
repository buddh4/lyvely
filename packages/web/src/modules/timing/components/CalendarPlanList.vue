<script lang="ts" setup>
import {
  CalendarPlan,
  CalendarIntervalEnum,
  isToday
} from "lyvely-common";
import Icon from "@/modules/ui/components/icon/Icon.vue";
import { useProfileStore } from "@/modules/user/store/profile.store";
import { useTimingStore } from "../store";
import { computed, ref } from 'vue';

interface Props {
  interval: CalendarIntervalEnum,
  count: number
}

const timingStore = useTimingStore();
const profileStore = useProfileStore();

const emit = defineEmits(['changed']);
const props = defineProps<Props>();

const collapsed = ref(false);
const title = computed(() => CalendarPlan.getInstance(props.interval).getTitle(timingStore.date, profileStore.locale));
const titleSuffix = computed(() => !props.count ? "" : ` · (${props.count})`);
const isEmpty = computed(() => !props.count);

function switchToToday() {
  timingStore.setCurrentDate(new Date());
}

const showTodayIcon = computed(() => props.interval === CalendarIntervalEnum.Daily && !isToday(timingStore.date));
const rightCaret = computed(() => (props.interval === CalendarIntervalEnum.Unscheduled) ? false : "▸");
const leftCaret = computed(() => (props.interval === CalendarIntervalEnum.Unscheduled) ? false : "◂");

const headerCssClass = computed(() => {
  const timingClass = `timing-${CalendarPlan.getInstance(props.interval).getLabel().toLocaleLowerCase()}`;

  return [
    "border-divide",
    "timing-list-item",
    "timing-list-header-item",
    "relative",
    timingClass
  ];
});

function incrementTiming() {
  useTimingStore().incrementTiming(props.interval);
  emit("changed", timingStore.date);
}

function decrementTiming() {
  useTimingStore().decrementTiming(props.interval);
  emit("changed", timingStore.date);
}
</script>

<template>
  <li ref="header" data-timing-header :data-count="props.count" :class="headerCssClass">
    <Icon v-if="showTodayIcon" name="today" @click="switchToToday" />
    <a v-if="leftCaret" class="switch-timing text-body no-underline" @click="decrementTiming">{{ leftCaret }}</a>
    <span class="timing-title text-body" @click="collapsed = !isEmpty && !collapsed">
      {{ title }}
      <small v-if="collapsed">{{ titleSuffix }}</small>
    </span>
    <a v-if="rightCaret" class="switch-timing text-body no-underline" @click="incrementTiming">{{ rightCaret }}</a>
  </li>

  <li v-if="!collapsed" data-timing-item-container class="p-0 border-0">
    <slot></slot>
  </li>
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

.timing-list-entry-root ul .list-group-item:first-child {
  border-top: 0;
}

.icon-today {
  position: absolute;
  left: 10px;
  width: 20px;
  float: left;
  margin-top: 3px;
  fill: var(--color-secondary);
  cursor: pointer;
}
</style>
