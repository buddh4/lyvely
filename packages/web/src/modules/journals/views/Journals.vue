<script lang="ts" setup>
import ActivityNavigation from '@/modules/activities/components/menus/ActivityNavigation.vue';
import ActivityFilterNavigation from '@/modules/activities/components/menus/ActivityFilterNavigation.vue';
import { computed, onBeforeMount, onMounted } from 'vue';
import { useActivityStore } from '@/modules/activities/store/activity.store';
import { accessibilityFocus } from '@/modules/accessibility/utils/accessibility.util';
import ContentRoot from '@/modules/ui/components/layout/ContentRoot.vue';
import { useContentCreateStore } from '@/modules/content/stores/content-create.store';
import { JournalModel } from '@lyvely/common';

onBeforeMount(() => useActivityStore().loadActivities());
//onMounted(() => accessibilityFocus('#activity-navigation > button.active'));

const createEntry = () => useContentCreateStore().createContentType(JournalModel.contentType);
const intervals = computed(() => getCalendarPlanArray());
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
