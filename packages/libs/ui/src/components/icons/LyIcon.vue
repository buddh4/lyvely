<script lang="ts" setup>
import { IconOptionsIF } from '@/types';
import { Translatable } from '@/i18n';
import {getIconLibrary} from "@/components/icons/registries";
import {computed} from "vue";

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
  <component v-if="iconComponent" :is="iconComponent" v-bind="iconBindings" />
</template>

<style>
.icon {
  fill: currentColor;
}

.icon.success {
  fill: var(--color-success);
}

.icon.primary {
  fill: var(--color-primary);
}

.icon.secondary {
  fill: var(--color-secondary);
}

.icon.warning {
  fill: var(--color-warning);
}

.icon.danger {
  fill: var(--color-danger);
}

.icon.info {
  fill: var(--color-info);
}
</style>
