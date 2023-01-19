<script lang="ts" setup>
import { ContentModel } from '@lyvely/common';
import { useContentService } from '@/modules/content/services/content.service';
import { computed } from 'vue';

interface IProps {
  content: ContentModel;
}

const props = withDefaults(defineProps<IProps>(), {});
const contentService = useContentService();

const archiveLabel = computed(() => (props.content.meta.isArchived ? 'Restore' : 'Archive'));
const archiveIcon = computed(() => (props.content.meta.isArchived ? 'unarchive' : 'archive'));

function onClickEdit() {}

function onClickArchive() {
  contentService.archive(props.content.id);
}
</script>

<template>
  <ly-dropdown button-class="pt-0 pr-0 item-menu-button">
    <ly-dropdown-link
      v-if="!content.meta.isArchived"
      icon="edit"
      label="Edit"
      @click="onClickEdit"></ly-dropdown-link>
    <ly-dropdown-link
      :label="archiveLabel"
      :icon="archiveIcon"
      @click="$emit('archive')"></ly-dropdown-link>
    <slot></slot>
  </ly-dropdown>
</template>

<style scoped>
.item-menu-button .icon {
  stroke-width: 0;
  stroke: currentColor;
  fill: currentColor;
  opacity: 0.5;
}
</style>
