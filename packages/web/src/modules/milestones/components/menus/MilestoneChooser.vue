<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useMilestonesStore } from '@/modules/milestones/stores/milestones.store';
import { ContentModel, MilestoneModel } from '@lyvely/common';
import { useSetContentMilestone } from '@/modules/content/composables/set-content-milestone.composable';

export interface IProps {
  content: ContentModel;
}

const props = defineProps<IProps>();

const milestonesStore = useMilestonesStore();
const milestones = ref(await milestonesStore.loadMilestones());
const { setMilestone } = useSetContentMilestone(props.content);
</script>

<template>
  <ly-divided-list>
    <ly-list-item
      v-for="milestone in milestones"
      :key="milestone.id"
      :active="milestone.id === content.meta.mid"
      @click="setMilestone(milestone.id)">
      <div class="flex items-center space-x-4 w-64">
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium truncate">
            {{ milestone.content.title }}
          </p>
          <ly-text-dimmed :text="milestone.content.text" />
        </div>
      </div>
    </ly-list-item>
  </ly-divided-list>
</template>

<style scoped></style>
