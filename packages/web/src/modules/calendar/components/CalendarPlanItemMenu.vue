<script lang="ts" setup>
import { TimeSeriesContentModel } from '@lyvely/common';
import { computed, toRefs } from 'vue';

export interface IProps {
  model: TimeSeriesContentModel;
}

const props = defineProps<IProps>();
defineEmits(['edit', 'archive']);

const archiveLabel = computed(() => (props.model.meta.isArchived ? 'Restore' : 'Archive'));

const { model } = toRefs(props);
</script>

<template>
  <ly-dropdown class="ml-auto" button-class="pt-0 pr-0 item-menu-button">
    <ly-dropdown-link v-if="!model.meta.isArchived" icon="edit" label="Edit" @click="$emit('edit')"></ly-dropdown-link>
    <ly-dropdown-link :label="archiveLabel" icon="archive" @click="$emit('archive')"></ly-dropdown-link>
    <slot></slot>
  </ly-dropdown>
</template>

<style>
.item-menu-button .icon {
  stroke-width: 0;
  stroke: currentColor;
  fill: currentColor;
  opacity: 0.5;
}

.item-menu {
  position: absolute;
  top: 5px;
  right: 5px;
}

.btn-item-menu {
  padding: 0 2px;
}
</style>
