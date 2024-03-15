<script lang="ts" setup>
import { ContentModel } from '@lyvely/interface';
import { useContentArchive } from '@/content/composables/content-archive.composable';
import { useContentEditStore } from '@/content/stores/content-edit.store';
import { computed, ref } from 'vue';
import { IConfirmOptions } from '@lyvely/ui';
import { getContentTypeOptions } from '../registries';
import { useProfileMenu } from '@/profiles';
import { MENU_CONTENT_DROPDOWN } from '@/content/content.constants';

export interface IProps {
  content: ContentModel;
}

const props = withDefaults(defineProps<IProps>(), {});

const showConfirm = ref(false);
const confirm = ref<IConfirmOptions>();
const confirmAction = ref<() => void>();

const { toggleArchive } = useContentArchive(props.content);

const { enabledMenuEntries } = useProfileMenu(MENU_CONTENT_DROPDOWN, props.content);

function onClickArchive() {
  confirmAction.value = toggleArchive;
  confirm.value = {
    text: props.content.meta.archived
      ? 'content.actions.confirm.restore'
      : 'content.actions.confirm.archive',
  };
  showConfirm.value = true;
}

function onClickEdit() {
  useContentEditStore().editContent(props.content);
}

const contentTypeOptions = getContentTypeOptions(props.content.type);
const isEditable = computed(
  () => contentTypeOptions?.interfaces?.edit !== false && !props.content.meta.archived,
);
</script>

<template>
  <ly-dropdown
    v-if="enabledMenuEntries.length"
    button-class="item-menu-button"
    :data-id="'menu-' + content.id">
    <ly-dropdown-link
      v-for="menuEntry in enabledMenuEntries"
      :key="menuEntry.id"
      :data-id="menuEntry.id"
      :icon="menuEntry.icon"
      :label="menuEntry.text"
      :route="menuEntry.to"
      @click="menuEntry?.click" />
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
