<script lang="ts" setup>
import { ContentModel, MilestoneModel } from '@lyvely/common';
import ContentStreamEntry from '@/modules/content-stream/components/ContentStreamEntry.vue';
import { IStream } from '@/modules/stream/composables/stream.composable';
import LyBadge from '@/modules/ui/components/badge/BadgeText.vue';

export interface IProps {
  model: MilestoneModel;
  stream: IStream<ContentModel>;
  index: number;
}

const props = defineProps<IProps>();
</script>

<template>
  <content-stream-entry v-bind="props" :merge="true">
    <template #image>
      <div class="flex justify-center rounded-full border border-divide w-8 h-8 bg-main">
        <router-link :to="{ name: 'Milestones' }">
          <ly-icon name="target" class="text-main h-3.5" />
        </router-link>
      </div>
    </template>

    <template #default>
      <div class="flex items-center gap-1">
        <ly-badge class="bg-secondary-dark">Milestone</ly-badge>
        <span>{{ model.content.title }}</span>
      </div>
      <div>
        <p v-if="model.content.text?.length" class="text-sm text-dimmed mt-2">
          {{ model.content.text }}
        </p>
      </div>
    </template>
  </content-stream-entry>
</template>

<style scoped></style>
