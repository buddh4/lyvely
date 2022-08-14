<script lang="ts" setup>
import { CalendarIntervalEnum , IJournal } from "@lyvely/common";
import { VueDraggableNext } from "vue-draggable-next";
import CalendarPlanList from "@/modules/timing/components/CalendarPlanList.vue";
import JournalListEntry from "@/modules/journal/components/JournalListEntry.vue";
import { useJournalStore } from '@/modules/journal/store';
import { computed } from 'vue';

interface Props {
  plan: CalendarIntervalEnum
}

const props = defineProps<Props>();
const emit = defineEmits(["edit", "archive"]);

const journals = computed(() => useJournalStore().journals(props.plan))
const count = computed(() => journals.value.length)
</script>

<template>
  <CalendarPlanList :plan="props.plan" :count="count">
    <draggable
      tag="ul"
      group="tasks"
      draggable=".list-group-item-draggable"
      :list="journals"
      handle=".icon-drag">
      <JournalListEntry v-for="journal in journals" :key="journal.id" :model="journal" />
    </draggable>
  </CalendarPlanList>
</template>

<style scoped></style>
