<script lang="ts" setup>
import { ContentModel, TaskModel } from '@lyvely/common';
import ContentStreamEntry from '@/modules/content-stream/components/ContentStreamEntry.vue';
import { IStream } from '@/modules/stream/composables/stream.composable';
import LyInputCheckbox from '@/modules/ui/components/form/CheckboxInput.vue';
import { computed } from 'vue';

export interface IProps {
  model: TaskModel;
  stream: IStream<ContentModel>;
  index: number;
}

const props = defineProps<IProps>();
const done = computed(() => !!props.model.done);
</script>

<template>
  <content-stream-entry v-bind="props" merge="true">
    <template #image>
      <div class="flex justify-center rounded-full border border-divide w-8 h-8 bg-main">
        <router-link :to="{ name: 'Tasks' }">
          <ly-icon name="task" class="text-main" />
        </router-link>
      </div>
    </template>

    <div class="inline-flex flex-col border border-divide p-4 rounded-xl bg-main inline-block">
      <ly-input-checkbox v-model="done" :label="model.content.title" :readonly="true" />
      <p v-if="model.content.text?.length" class="text-sm text-dimmed ml-7">
        {{ model.content.text }}
      </p>
    </div>
  </content-stream-entry>
</template>

<style scoped></style>
