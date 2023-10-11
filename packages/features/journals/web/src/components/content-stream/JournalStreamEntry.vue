<script lang="ts" setup>
import { JournalModel } from '@lyvely/journals-interface';
import { ContentModel } from '@lyvely/core-interface';
import ContentStreamEntry from '@/content-stream/components/ContentStreamEntry.vue';
import { IStream } from '@/stream/composables/stream.composable';

export interface IProps {
  model: JournalModel;
  stream: IStream<ContentModel>;
  index: number;
}

const props = defineProps<IProps>();
</script>

<template>
  <content-stream-entry v-bind="props">
    <template #image>
      <div class="flex justify-center rounded-full border border-divide w-8 h-8 bg-main">
        <router-link :to="{ name: 'Habits' }">
          <ly-icon name="activity" class="text-main" />
        </router-link>
      </div>
    </template>

    <template #default>
      <div>
        <span>{{ model.content.title }}</span>
        <p v-if="model.content.text?.length" class="text-sm text-dimmed">
          {{ model.content.text }}
        </p>
      </div>
    </template>
  </content-stream-entry>
</template>

<style scoped></style>
