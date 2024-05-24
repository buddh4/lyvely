<script lang="ts" setup>
import { HabitModel } from '@lyvely/habits-interface';
import { ContentModel, ContentStreamEntry, IStream } from '@lyvely/web';
import { LyIcon } from '@lyvely/ui';

export interface IProps {
  model: HabitModel;
  stream: IStream<ContentModel>;
  index: number;
}

const props = defineProps<IProps>();
</script>

<template>
  <content-stream-entry v-bind="props">
    <template #image>
      <div class="border-divide bg-main flex h-8 w-8 justify-center rounded-full border">
        <router-link :to="{ name: 'Habits' }">
          <ly-icon name="activity" class="text-main" />
        </router-link>
      </div>
    </template>

    <template #default>
      <div>
        <span>{{ model.content.title }}</span>
        <p v-if="model.content.text?.length" class="text-dimmed text-sm">
          {{ model.content.text }}
        </p>
      </div>
    </template>
  </content-stream-entry>
</template>

<style scoped></style>
