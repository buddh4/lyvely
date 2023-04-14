<script lang="ts" setup>
import { IconName, getIconByName } from '@/modules/ui/components/icon/Icons';
import { computed } from 'vue';
import { StyleDefinition } from '@/util/component.types';
import { IconOptionsIF } from '@/modules/ui/types';
import { includesUtilityClass } from '@/modules/ui/utils';

export interface IProps {
  name?: IconName;
  title?: string;
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

const name = computed(() => props.name || props.options?.name || '');
const definition = computed(() => getIconByName(name.value));
const styleObject = computed(
  (): StyleDefinition => (props.options?.fill ? { fill: props.options.fill } : {}),
);

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

const transform = computed(() => {
  if (!props.scaleTo && !props.autoScale) return;

  const scaleTo = props.scaleTo || 24;

  try {
    const size = parseInt(definition.value?.viewBox.split(' ').at(-1) as string);
    if (size === scaleTo) return;
    const ratio = scaleTo / size;
    return `scale(${ratio})`;
  } catch (e) {
    console.log(e);
  }
});
</script>

<template>
  <svg
    v-if="definition"
    aria-hidden="true"
    :class="getClassNames($attrs.class)"
    :style="styleObject"
    :viewBox="definition.viewBox">
    <title v-if="title">{{ $t(title) }}</title>
    <path v-for="path in definition.paths" :key="path" :d="path" :transform="transform"></path>
  </svg>
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
