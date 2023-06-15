<script lang="ts" setup>
import { MilestoneModel, toTimingId } from '@lyvely/common';
import CalendarPlanItem from '@/modules/calendar-plan/components/CalendarPlanItem.vue';
import { useMilestoneCalendarPlanStore } from '@/modules/milestones/stores/milestone-calendar-plan.store';
import ContentDropdown from '@/modules/content/components/ContentDropdown.vue';
import { useCalendarPlanPlanItem } from '@/modules/calendar-plan/composables/calendar-plan-item.composable';
import { computed } from 'vue';
import { useCalendarPlanStore } from '@/modules/calendar-plan';
import { storeToRefs } from 'pinia';
import { useProfileStore } from '@/modules/profiles/stores/profile.store';
import { useRouter } from 'vue-router';
import { toContentDetails } from '@/modules/content-stream';

export interface IProps {
  model: MilestoneModel;
}

const props = defineProps<IProps>();
const calendarPlanStore = useCalendarPlanStore();
const milestoneStore = useMilestoneCalendarPlanStore();
const { selectTag } = milestoneStore;
const { locale } = storeToRefs(useProfileStore());
const router = useRouter();

const { moveUp, moveDown } = useCalendarPlanPlanItem(props.model, milestoneStore);

const progress = computed(() => {
  const tid = toTimingId(calendarPlanStore.date, props.model.interval, locale.value);
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
      <div class="w-40 ml-auto">
        <ly-progress-bar :progress="progress" class="cursor-pointer" @click="toDetails" />
      </div>
    </template>
  </calendar-plan-item>
</template>

<style scoped></style>
