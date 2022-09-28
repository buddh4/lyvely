<script lang="ts" setup>
import { ITimeSeriesContent } from "@lyvely/common";
import { computed, toRefs } from "vue";
import LyDropdown from "@/modules/ui/components/menu/DropdownMenu.vue";
import LyDropdownLink from "@/modules/ui/components/menu/DropdownLink.vue";

interface IProps {
  model: ITimeSeriesContent;
}

const props = defineProps<IProps>();
defineEmits(["edit", "archive"]);

const archiveLabel = computed(() =>
  props.model.archived ? "Restore" : "Archive"
);

const { model } = toRefs(props);
</script>

<template>
  <ly-dropdown class="ml-auto" button-class="pt-0 pr-0 item-menu-button">
    <ly-dropdown-link
      v-if="!model.archived"
      icon="edit"
      label="Edit"
      @click="$emit('edit')"
    ></ly-dropdown-link>
    <dropdown-link
      :label="archiveLabel"
      icon="archive"
      @click="$emit('archive')"
    ></dropdown-link>
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
