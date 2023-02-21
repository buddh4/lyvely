<script lang="ts" setup>
import { computed, onBeforeMount, onMounted } from 'vue';
import ContentRoot from '@/modules/ui/components/layout/ContentRoot.vue';
import CalendarPlan from '@/modules/calendar/components/CalendarPlan.vue';
import CalendarPlanSection from '@/modules/calendar/components/CalendarPlanSection.vue';
import { useContentCreateStore } from '@/modules/content/stores/content-create.store';
import { JournalModel, getCalendarIntervalArray } from '@lyvely/common';
import { useJournalStore } from '@/modules/journals/stores/journals.store';
import Draggable from 'vuedraggable';

onBeforeMount(() => useJournalStore().loadModels());
//onMounted(() => accessibilityFocus('#activity-navigation > button.active'));

const;

const createEntry = () => useContentCreateStore().createContentType(JournalModel.contentType);
const intervals = computed(() => getCalendarIntervalArray());
</script>

<template>
  <content-root>
    <calendar-plan>
      <calendar-plan-section
        v-for="interval in intervals"
        :key="interval"
        :interval="interval"
        :count="activities.length"
        :create-button-title="$t(createTitle)"
        @create="addEntry">
        <draggable
          :list="activities"
          tag="div"
          class="calendar-plan-items divide-y divide-divide border-x border-divide"
          :data-calendar-interval="interval"
          group="habits"
          handle=".icon-drag"
          item-key="id"
          @end="dragEnd">
          <template #item="{ element }">
            <div :data-cid="element.id"></div>
          </template>
        </draggable>
      </calendar-plan-section>
    </calendar-plan>

    <floating-add-button @click="createEntry" />
  </content-root>
</template>

<style scoped></style>
