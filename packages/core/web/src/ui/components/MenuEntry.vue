<script setup lang="ts">
import { IMenuEntry } from '../menus';
import { t } from '@/i18n';
import { Translatable } from '@lyvely/ui';
import { unref } from 'vue';

interface IProps {
  entry: IMenuEntry;
  iconClass?: string;
  showLabels?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  iconClass: '',
  showLabels: true,
});

function onMenuItemClick() {
  if (props.entry.click) props.entry.click();
}
</script>

<template>
  <router-link
    v-if="entry.to"
    :to="entry.to"
    :data-menu-entry-id="entry.id"
    @click="onMenuItemClick">
    <ly-icon v-if="typeof entry.icon === 'string'" :name="entry.icon" :class="iconClass" />
    <ly-icon v-else-if="typeof entry.icon === 'object'" v-bind="entry.icon" :class="iconClass" />
    <transition name="fade">
      <span v-if="showLabels">
        {{ t(unref<Translatable>(entry.text)) }}
      </span>
    </transition>
  </router-link>
  <a v-else-if="entry.click" :data-menu-entry-id="entry.id" @click="onMenuItemClick">
    <ly-icon v-if="typeof entry.icon === 'string'" :name="entry.icon" :class="iconClass" />
    <ly-icon v-else-if="typeof entry.icon === 'object'" v-bind="entry.icon" :class="iconClass" />
    <transition name="fade">
      <span v-if="showLabels">
        {{ t(unref<Translatable>(entry.text)) }}
      </span>
    </transition>
  </a>
</template>

<style scoped></style>
