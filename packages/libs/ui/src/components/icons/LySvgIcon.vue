<script lang="ts" setup>
import { IconName, getSvgIconByName } from './ly-svg-icon.registry';
import { computed } from 'vue';
import { IconOptionsIF } from './icon-options.interface';
import { includesUtilityClass } from '@/helpers';
import { t, Translatable } from '@/i18n';

export interface IProps {
  name?: IconName;
  title?: Translatable;
  options?: IconOptionsIF;
  scaleTo?: number;
  autoScale?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  name: '',
  options: undefined,
  title: undefined,
  scaleTo: 0,
  autoScale: false,
});

const name = computed<IconName>(() => props.name || props.options?.name || '');
const definition = computed(() => getSvgIconByName(name.value));
const styleObject = computed(() => (props.options?.fill ? { fill: props.options.fill } : {}));

function getClassNames(attrClasses: any) {
  const result = {
    icon: true,
    'w-4': !includesUtilityClass(attrClasses, 'w'),
    inline: true,
    [`icon-${name.value}`]: true,
  };

  if (props.options?.color) {
    result[props.options.color.toString()] = true;
  }

  return result;
}

const transform = computed<string | undefined>(() => {
  if (!props.scaleTo && !props.autoScale) return undefined;

  const scaleTo = props.scaleTo || 24;

  try {
    const size = parseInt(definition.value?.viewBox.split(' ').at(-1) as string);
    if (size === scaleTo) return undefined;
    const ratio = scaleTo / size;
    return `scale(${ratio})`;
  } catch (e) {
    console.log(e);
  }

  return undefined;
});
</script>

<template>
  <svg
    v-if="definition"
    aria-hidden="true"
    :class="getClassNames($attrs.class)"
    :style="styleObject"
    :viewBox="definition.viewBox">
    <title v-if="title">{{ t(title) }}</title>
    <path v-for="path in definition.paths" :key="path" :d="path" :transform="transform"></path>
  </svg>
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
