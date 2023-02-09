<script lang="ts" setup>
import { ContentModel } from '@lyvely/common';
import { useContentArchive } from '@/modules/content/composables/content-archive.composable';
import { reactive } from 'vue-demi';
import { useContentEditStore } from '@/modules/content/stores/content-edit.store';
import { computed, ref } from 'vue';
import { IConfirmOptions } from '@/modules/ui/components/modal/IConfirmOptions';

export interface IProps {
  content: ContentModel;
}

const props = withDefaults(defineProps<IProps>(), {});

const showConfirm = ref(false);
const confirm = ref<IConfirmOptions>();
const confirmAction = ref<() => void>();

const { archiveIcon, archiveLabel, toggleArchive } = useContentArchive(props.content);

function onClickArchive() {
  confirmAction.value = toggleArchive;
  confirm.value = {
    text: props.content.meta.isArchived
      ? 'content.actions.confirm.unarchive'
      : 'content.actions.confirm.archive',
  };
  showConfirm.value = true;
}

function onClickEdit() {
  useContentEditStore().setEditContent(props.content);
}

const isEditable = computed(() => !props.content.meta.isArchived);
</script>

<template>
  <ly-dropdown button-class="item-menu-button">
    <ly-dropdown-link
      v-if="isEditable"
      icon="edit"
      label="content.actions.edit"
      @click="onClickEdit"></ly-dropdown-link>
    <ly-dropdown-link
      :label="archiveLabel"
      :icon="archiveIcon"
      @click="onClickArchive"></ly-dropdown-link>
    <slot></slot>
  </ly-dropdown>
  <ly-confirm v-if="showConfirm" v-model="showConfirm" :options="confirm" @submit="confirmAction">
    <slot name="confirmBody"></slot>
  </ly-confirm>
</template>

<style scoped>
.item-menu-button .icon {
  stroke-width: 0;
  stroke: currentColor;
  fill: currentColor;
  opacity: 0.5;
}
</style>
