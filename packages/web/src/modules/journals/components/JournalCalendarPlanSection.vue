<script lang="ts" setup>
import CalendarPlanSection from '@/modules/calendar-plan/components/CalendarPlanSection.vue';
import Draggable from 'vuedraggable';
import { useJournalPlanStore } from '@/modules/journals/stores/journal-plan.store';
import { computed } from 'vue';
import { JournalModel } from '@lyvely/common';
import { useContentCreateStore } from '@/modules/content/stores/content-create.store';
import JournalCalendarPlanItem from '@/modules/journals/components/JournalCalendarPlanItem.vue';

export interface IProps {
  interval: number;
}

const props = defineProps<IProps>();

const journalsStore = useJournalPlanStore();
const { sort } = journalsStore;

const journals = computed(() => journalsStore.getModels(props.interval));

const createEntry = () =>
  useContentCreateStore().createContentType(JournalModel.contentType, { interval: props.interval });
</script>

<template>
  <calendar-plan-section
    :interval="interval"
    :count="journals.length"
    create-button-title="journals.create.title"
    @create="createEntry">
    <draggable
      :list="journals"
      tag="div"
      class="calendar-plan-items divide-y divide-divide border-x border-divide"
      :data-calendar-interval="interval"
      group="habits"
      handle=".icon-drag"
      item-key="id"
      @end="sort">
      <template #item="{ element }">
        <div :data-cid="element.id">
          <journal-calendar-plan-item :model="element" />
        </div>
      </template>
    </draggable>
  </calendar-plan-section>
</template>

<style scoped></style>
