<script lang="ts" setup>
import { ContentModel } from '@lyvely/common';
import { useContentArchive } from '@/modules/content/composables/content-archive.composable';
import { reactive } from 'vue-demi';

interface IProps {
  content: ContentModel;
}

const props = withDefaults(defineProps<IProps>(), {});

const content = reactive(props.content);
const { archiveIcon, archiveLabel, toggleArchive } = useContentArchive(content);

function onClickEdit() {}
</script>

<template>
  <ly-dropdown button-class="item-menu-button">
    <ly-dropdown-link
      v-if="!content.meta.isArchived"
      icon="edit"
      label="Edit"
      @click="onClickEdit"></ly-dropdown-link>
    <ly-dropdown-link
      :label="archiveLabel"
      :icon="archiveIcon"
      @click="toggleArchive"></ly-dropdown-link>
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
