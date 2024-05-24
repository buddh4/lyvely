<script lang="ts" setup>
import { MilestoneModel } from '@lyvely/milestones-interface';
import { ContentModel, IStream, ContentStreamEntry } from '@lyvely/web';
import { LyIcon } from '@lyvely/ui';

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
      <div class="border-divide bg-main flex h-8 w-8 justify-center rounded-full border">
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
        <p v-if="model.content.text?.length" class="text-dimmed mt-2 text-sm">
          {{ model.content.text }}
        </p>
      </div>
    </template>
  </content-stream-entry>
</template>

<style scoped></style>
