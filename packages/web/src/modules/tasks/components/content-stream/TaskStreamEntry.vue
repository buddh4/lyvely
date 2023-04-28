<script lang="ts" setup>
import { ContentModel, TaskModel } from '@lyvely/common';
import ContentStreamEntry from '@/modules/content-stream/components/ContentStreamEntry.vue';
import { IStream } from '@/modules/stream/composables/stream.composable';
import LyInputCheckbox from '@/modules/ui/components/form/CheckboxInput.vue';
import { computed } from 'vue';
import LyBadge from '@/modules/ui/components/badge/BadgeText.vue';

export interface IProps {
  model: TaskModel;
  stream: IStream<ContentModel>;
  index: number;
}

const props = defineProps<IProps>();
const done = computed(() => !!props.model.done);
</script>

<template>
  <content-stream-entry v-bind="props" :merge="true">
    <template #image>
      <div class="flex justify-center rounded-full border border-divide w-8 h-8 bg-main">
        <router-link :to="{ name: 'Tasks' }">
          <ly-icon name="task" class="text-main" />
        </router-link>
      </div>
    </template>

    <template #default>
      <div>
        <div class="flex items-center gap-1">
          <span>{{ model.content.title }}</span>
        </div>
        <p v-if="model.content.text?.length" class="text-sm text-dimmed">
          {{ model.content.text }}
        </p>
      </div>
    </template>
  </content-stream-entry>
</template>

<style scoped></style>
