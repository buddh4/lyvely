<script lang="ts" setup>
import Dropdown from '@/modules/ui/components/menu/Dropdown.vue';
import DropdownLink from '@/modules/ui/components/menu/DropdownLink.vue';
import { TimeableContent } from 'lyvely-common';
import { computed, toRefs } from 'vue';

interface Props {
  model: TimeableContent
}

const props = defineProps<Props>();
defineEmits(["edit", "archive"]);

const archiveLabel = computed(() => props.model.archived ? "Restore" : "Archive");

const { model } = toRefs(props);
</script>

<template>
  <Dropdown class="ml-auto" button-class="pt-0 pr-0 item-menu-button">
    <DropdownLink v-if="!model.archived" icon="edit" label="Edit" @click="$emit('edit')"></DropdownLink>
    <DropdownLink :label="archiveLabel" icon="archive" @click="$emit('archive')"></DropdownLink>
    <slot></slot>
  </Dropdown>
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
