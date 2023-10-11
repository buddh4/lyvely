<script lang="ts" setup>
import { TagModel } from '@lyvely/core-interface';

export interface IProps {
  tag: TagModel;
}

defineProps<IProps>();
</script>

<template>
  <ly-badge :color="tag.color" :data-tag-id="tag.id" :translate="false">
    {{ tag.name }}
  </ly-badge>
</template>

<style scoped></style>
