<script lang="ts" setup>
import type { IconOptionsIF } from './icon-options.interface';
import { Translatable } from '@/i18n';
import { getIconLibrary } from './icon-library.registry';
import { computed } from 'vue';

export interface IProps {
  name?: string;
  lib?: string;
  libBindings?: any;
  title?: Translatable;
  options?: IconOptionsIF;
  scaleTo?: number;
  autoScale?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  name: '',
  lib: 'ly',
  libBindings: undefined,
  options: undefined,
  title: undefined,
  scaleTo: 0,
  autoScale: false,
});

const library = computed(() => getIconLibrary(props.lib));
const iconComponent = computed(() => library.value?.component);
const iconBindings = computed(() => library.value?.getBindings(props));
</script>

<template>
  <component :is="iconComponent" v-if="iconComponent" v-bind="iconBindings" />
</template>

<style>
.icon {
  fill: currentColor;
}

.icon.success {
  fill: rgb(var(--color-success) / 1);
}

.icon.primary {
  fill: rgb(var(--color-primary) / 1);
}

.icon.secondary {
  fill: rgb(var(--color-secondary) / 1);
}

.icon.warning {
  fill: rgb(var(--color-warning) / 1);
}

.icon.danger {
  fill: rgb(var(--color-danger) / 1);
}

.icon.info {
  fill: rgb(var(--color-info) / 1);
}
</style>
