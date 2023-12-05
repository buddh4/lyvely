<script setup lang="ts">
import {IconBindingsIf, IMenuEntry} from './interfaces';
import { t } from '@/i18n';
import {computed} from 'vue';
import { isPlainObject } from '@lyvely/common';
import { twMerge } from 'tailwind-merge';

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

const iconBindings = computed(() => {
  if (isPlainObject(props.entry.iconBindings)) {
    const iconBindings = { ...props.entry.iconBindings } as IconBindingsIf;
    iconBindings.class ??= '';
    iconBindings.class = twMerge(iconBindings.class, props.iconClass);
    return iconBindings;
  }
  return { class: props.iconClass };
});
</script>

<template>
  <router-link v-if="entry.to" :to="entry.to" :data-id="entry.id" @click="onMenuItemClick">
    <ly-icon v-if="entry.icon" :name="entry.icon" v-bind="iconBindings" :class="iconClass" />
    <transition name="fade">
      <span v-if="showLabels">
        {{ t(entry.text) }}
      </span>
    </transition>
  </router-link>
  <a v-else-if="entry.click" :data-id="entry.id" @click="onMenuItemClick">
    <ly-icon v-if="entry.icon" :name="entry.icon" v-bind="iconBindings" :class="iconClass" />
    <transition name="fade">
      <span v-if="showLabels">
        {{ t(entry.text) }}
      </span>
    </transition>
  </a>
</template>

<style scoped></style>
