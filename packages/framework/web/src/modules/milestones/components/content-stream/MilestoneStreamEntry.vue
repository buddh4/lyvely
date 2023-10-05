<script lang="ts" setup>
import { MilestoneModel } from '@lyvely/milestones-interface';
import { ContentModel } from '@lyvely/content-interface';
import ContentStreamEntry from '@/modules/content-stream/components/ContentStreamEntry.vue';
import { IStream } from '@/modules/stream/composables/stream.composable';

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
