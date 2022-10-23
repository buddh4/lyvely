<script lang="ts" setup>
import { TagModel } from "@lyvely/common";

export interface IProps {
  tag: TagModel;
}

defineProps<IProps>();
</script>

<template>
  <ly-badge
    :key="tag.name"
    :color="tag.color"
    :data-tag-id="tag.id"
    class="mr-0.5"
  >
    {{ tag.name }}
  </ly-badge>
</template>

<style scoped></style>
