<script lang="ts" setup>
import MilestoneCalendarPlanItem from '@/modules/milestones/components/calendar-plan/MilestoneCalendarPlanItem.vue';
import CalendarPlanSection from '@/modules/calendar-plan/components/CalendarPlanSection.vue';
import { useMilestoneCalendarPlanStore } from '@/modules/milestones/stores/milestone-calendar-plan.store';
import { computed } from 'vue';
import Draggable from 'vuedraggable';
import { useContentCreateStore } from '@/modules/content/stores/content-create.store';
import { MilestoneModel } from '@lyvely/milestones-interface';

export interface IProps {
  interval: number;
}

const props = defineProps<IProps>();

const milestonePlanStore = useMilestoneCalendarPlanStore();
const { sort } = milestonePlanStore;

const milestones = computed(() => {
  return milestonePlanStore.getModels(props.interval);
});

const addEntry = () =>
  useContentCreateStore().createContentType(MilestoneModel.contentType, {
    interval: props.interval,
  });
</script>

<template>
  <calendar-plan-section
    :interval="interval"
    :count="milestones.length"
    create-button-title="milestones.create.title"
    @create="addEntry">
    <draggable
      :list="milestones"
      tag="div"
      class="calendar-plan-items divide-y divide-divide border-x border-divide"
      :data-calendar-interval="interval"
      group="milestones"
      handle=".icon-drag"
      item-key="id"
      @end="sort">
      <template #item="{ element }">
        <div>
          <milestone-calendar-plan-item :model="element" />
        </div>
      </template>
    </draggable>
  </calendar-plan-section>
</template>

<style scoped></style>
