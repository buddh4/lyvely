<script lang="ts" setup>
import {
  CalendarPlan,
  CalendarIntervalEnum,
  isToday
} from "@lyvely/common";
import Button from "@/modules/ui/components/button/Button.vue";
import Icon from "@/modules/ui/components/icon/Icon.vue";
import { useProfileStore } from "@/modules/user/store/profile.store";
import { useTimingStore } from "../store";
import { computed, ref } from 'vue';
import { onClickOutside } from '@vueuse/core'

interface Props {
  interval: CalendarIntervalEnum,
  count: number
}

const timingStore = useTimingStore();
const profileStore = useProfileStore();

const emit = defineEmits(['changed', 'create']);
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

const showCreateButton = ref(false);
const header = ref(null);
onClickOutside(header, (event) => showCreateButton.value = false);

</script>

<template>
  <div ref="header" tabindex="0" data-timing-header :data-count="count" :class="headerCssClass" @focusin="showCreateButton = true">
    <Icon v-if="showTodayIcon" name="today" @click="switchToToday" />
    <a v-if="leftCaret" class="switch-timing text-body no-underline" @click="decrementTiming">{{ leftCaret }}</a>
    <span class="timing-title text-body" @click="collapsed = !isEmpty && !collapsed">
      {{ title }}
      <small v-if="collapsed">{{ titleSuffix }}</small>
    </span>
    <a v-if="rightCaret" class="switch-timing text-body no-underline" @click="incrementTiming">{{ rightCaret }}</a>

    <Button v-if="showCreateButton" class="secondary outlined absolute right-2 mr-0.5 mt-1 inline-flex items-center text-xs py-0 px-1 text-xs" @click="showCreateButton = false;$emit('create')">+</Button>
  </div>

  <div v-if="!collapsed" data-timing-item-container class="p-0 border-0">
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
