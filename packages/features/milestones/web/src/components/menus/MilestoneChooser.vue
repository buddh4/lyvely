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
  <ul v-if="statusError" class="w-64 divide-y divide-divide md:w-96">
    <li class="px-4 py-3">
      <ly-alert type="danger" :text="statusError" />
    </li>
  </ul>
  <ul v-else class="w-80 divide-y divide-divide md:w-96">
    <li class="px-4 py-3">
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
          <div class="flex w-64 items-center space-x-4">
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-medium">
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
