<script lang="ts" setup>
import { ContentModel } from '@lyvely/interface';
import { LyMarkdownView } from '@lyvely/ui';
import type { TaskListClickEvent } from '@lyvely/ui';
import { useContentStore } from '../stores';

export interface IProps {
  model: ContentModel;
}

const props = defineProps<IProps>();

const updateTaskListItem = (evt: TaskListClickEvent) => {
  useContentStore().updateTaskListItem(props.model, evt);
};
</script>

<template>
  <ly-markdown-view
    :md="model.content.text"
    :max-width="false"
    :editable="model.policies.canWrite"
    @update-task-list-item="updateTaskListItem" />
</template>

<style scoped></style>
