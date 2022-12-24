<script lang="ts" setup>
import { TaskModel } from '@lyvely/common';
import ContentStreamEntry from '@/modules/content-stream/components/ContentStreamEntry.vue';

export interface IProps {
  model: TaskModel;
}

const props = defineProps<IProps>();
</script>

<template>
  <content-stream-entry :model="model">
    {{ model.content.title }}
    {{ model.content.text }}
  </content-stream-entry>
</template>

<style scoped></style>
