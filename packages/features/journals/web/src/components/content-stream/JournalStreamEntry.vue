<script lang="ts" setup>
import { JournalModel } from '@lyvely/journals-interface';
import { ContentModel, IStream, ContentStreamEntry } from '@lyvely/web';
import { LyIcon } from '@lyvely/ui';

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
      <div class="flex h-8 w-8 justify-center rounded-full border border-divide bg-main">
        <router-link :to="{ name: 'Journals' }">
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
