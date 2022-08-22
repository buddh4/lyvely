<script lang="ts" setup>
import Badge from "@/modules/ui/components/badge/Badge.vue";
import { ITag } from "@lyvely/common";

interface Props {
  tag: ITag
}

const props = defineProps<Props>();
</script>

<template>
    <Badge
        :key="tag.name"
        :color="tag.color"
        :data-tag-id="tag.id"
        class="mr-0.5">
      {{ tag.name }}
    </Badge>
</template>

<style scoped>
</style>
