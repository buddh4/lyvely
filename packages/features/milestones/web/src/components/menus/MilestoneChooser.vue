<script lang="ts" setup>
import { ref } from 'vue';
import { useMilestonesStore } from '@/stores';
import { MilestoneModel, UpdateMilestoneResponse } from '@lyvely/milestones-interface';
import { ContentModel, useSetContentMilestone, useContentCreateStore, t } from '@lyvely/web';
import { storeToRefs } from 'pinia';
import { LyAlert, LyAddButton, LyDividedList, LyListItem, LyDimmed } from '@lyvely/ui';

export interface IProps {
  content: ContentModel;
}

const props = defineProps<IProps>();

const milestonesStore = useMilestonesStore();
const milestones = ref(await milestonesStore.loadMilestones());
const { setMilestone } = useSetContentMilestone(props.content);
const { statusError } = storeToRefs(milestonesStore);

const createMilestone = () =>
  useContentCreateStore()
    .createContentType(MilestoneModel.contentType)
    .then((response?: UpdateMilestoneResponse) => {
      if (response) setMilestone(response.model.id);
    });
</script>

<template>
  <ul v-if="statusError" class="divide-y divide-divide w-64 md:w-96">
    <li class="py-3 px-4">
      <ly-alert type="danger" :message="statusError" />
    </li>
  </ul>
  <ul v-else class="divide-y divide-divide w-80 md:w-96">
    <li class="py-3 px-4">
      <div class="flex items-center">
        <span class="text-sm font-bold">
          {{ t('milestones.title') }}
        </span>
        <ly-add-button class="m-auto" @click="createMilestone" />
      </div>
    </li>
    <li v-if="milestones.length">
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
              <ly-dimmed
                v-if="milestone.content.text"
                :text="{ plain: milestone.content.text }"
                :truncate="true" />
            </div>
          </div>
        </ly-list-item>
      </ly-divided-list>
    </li>
  </ul>
</template>

<style scoped></style>
