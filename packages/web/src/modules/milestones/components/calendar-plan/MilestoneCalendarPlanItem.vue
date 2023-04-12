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

export interface IProps {
  model: MilestoneModel;
}

const props = defineProps<IProps>();
const calendarPlanStore = useCalendarPlanStore();
const milestoneStore = useMilestoneCalendarPlanStore();
const { selectTag } = milestoneStore;
const { locale } = storeToRefs(useProfileStore());

const { moveUp, moveDown } = useCalendarPlanPlanItem(props.model, milestoneStore);

const relations = computed(() => {
  const tid = toTimingId(calendarPlanStore.date, props.model.interval, locale.value);
  return milestoneStore.cache.getRelations(props.model, tid);
});
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
    <template #body>
      <div v-for="relation in relations" :key="relation.cid">
        {{ relation.cid }}
      </div>
    </template>
  </calendar-plan-item>
</template>

<style scoped></style>
