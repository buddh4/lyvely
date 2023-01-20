<script lang="ts" setup>
import { ContentModel, TaskModel } from '@lyvely/common';
import ContentStreamEntry from '@/modules/content-stream/components/ContentStreamEntry.vue';
import { IStream } from '@/modules/stream/composables/stream.composable';
import ContentDetails from '@/modules/content-stream/components/ContentDetails.vue';
import LyInputCheckbox from '@/modules/ui/components/form/CheckboxInput.vue';

export interface IProps {
  model: TaskModel;
}

const props = defineProps<IProps>();
</script>

<template>
  <content-details :model="model">
    <template #image>
      <div class="flex justify-center rounded-full border border-divide w-8 h-8 bg-main">
        <router-link :to="{ name: 'Tasks' }">
          <ly-icon name="task" class="text-main" />
        </router-link>
      </div>
    </template>
    <template #body> <ly-input-checkbox :label="model.content.title" /> </template>
  </content-details>
</template>

<style scoped></style>
