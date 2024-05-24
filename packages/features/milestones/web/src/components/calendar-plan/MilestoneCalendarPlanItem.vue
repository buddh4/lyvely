<script lang="ts" setup>
import { toTimingId } from '@lyvely/dates';
import { MilestoneModel } from '@lyvely/milestones-interface';
import {
  CalendarPlanItem,
  useCalendarPlanItem,
  useCalendarPlanStore,
} from '@lyvely/calendar-plan-web';
import { useMilestoneCalendarPlanStore } from '@/stores';
import { ContentDropdown, useProfileStore, toContentDetails } from '@lyvely/web';
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { LyProgressBar } from '@lyvely/ui';

export interface IProps {
  model: MilestoneModel;
}

const props = defineProps<IProps>();
const calendarPlanStore = useCalendarPlanStore();
const milestoneStore = useMilestoneCalendarPlanStore();
const profileStore = useProfileStore();
const { selectTag } = milestoneStore;
const { locale } = storeToRefs(profileStore);
const router = useRouter();

const { moveUp, moveDown } = useCalendarPlanItem(props.model, milestoneStore);

const progress = computed(() => {
  const tid = toTimingId(
    calendarPlanStore.date,
    props.model.interval,
    locale.value,
    profileStore.getSetting('calendar'),
  );
  return milestoneStore.cache.calculateProgress(props.model, tid);
});

const toDetails = () => {
  router.push(toContentDetails(props.model));
};
</script>

<template>
  <calendar-plan-item
    :model="model"
    @move-up="moveUp"
    @move-down="moveDown"
    @select-tag="selectTag">
    <template #menu>
      <content-dropdown :content="model" />
    </template>
    <template #rating>
      <div class="ml-auto w-40">
        <ly-progress-bar :progress="progress" class="cursor-pointer" @click="toDetails" />
      </div>
    </template>
  </calendar-plan-item>
</template>

<style scoped></style>
