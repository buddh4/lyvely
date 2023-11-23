<script setup lang="ts">
import { IMenuEntry } from './interfaces';
import { t } from '@/i18n';
import { toValue } from 'vue';
import { isPlainObject } from '@lyvely/common';

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

function getIconClass() {
  if (isPlainObject(props.entry.icon)) {
    const icon = toValue(props.entry.icon) as any;
    return icon.class || props.iconClass;
  }
  return props.iconClass;
}
</script>

<template>
  <router-link v-if="entry.to" :to="entry.to" :data-id="entry.id" @click="onMenuItemClick">
    <ly-icon v-if="typeof entry.icon === 'string'" :name="entry.icon" :class="iconClass" />
    <ly-icon v-else-if="isPlainObject(entry.icon)" v-bind="entry.icon" :class="getIconClass()" />
    <transition name="fade">
      <span v-if="showLabels">
        {{ t(toValue(entry.text)) }}
      </span>
    </transition>
  </router-link>
  <a v-else-if="entry.click" :data-id="entry.id" @click="onMenuItemClick">
    <ly-icon v-if="typeof entry.icon === 'string'" :name="entry.icon" :class="iconClass" />
    <ly-icon v-else-if="isPlainObject(entry.icon)" v-bind="entry.icon" :class="iconClass" />
    <transition name="fade">
      <span v-if="showLabels">
        {{ t(toValue(entry.text)) }}
      </span>
    </transition>
  </a>
</template>

<style scoped></style>
