<script lang="ts" setup>
import CalendarPlan from '@/modules/calendar/components/CalendarPlan.vue';
import { getCalendarPlanArray, JournalModel } from '@lyvely/common';
import { computed } from 'vue';
import FloatingAddButton from '@/modules/ui/components/button/FloatingAddButton.vue';
import { useContentCreateStore } from '@/modules/content/stores/content-create.store';

const createEntry = () => useContentCreateStore().createContentType(JournalModel.contentType);
const intervals = computed(() => getCalendarPlanArray());
</script>

<template>
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
</template>

<style scoped></style>
