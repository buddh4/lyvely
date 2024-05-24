<script lang="ts" setup>
import { ContentModel } from '@lyvely/interface';
import { useProfileMenu } from '@/profiles';
import { MENU_CONTENT_DROPDOWN } from '@/content/content.constants';

export interface IProps {
  content: ContentModel;
}

const props = withDefaults(defineProps<IProps>(), {});

const { enabledMenuEntries } = useProfileMenu(MENU_CONTENT_DROPDOWN, props.content);
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
