<script lang="ts" setup>
import { computed, toRefs } from 'vue';
import { StyleDefinition } from '@/util/component.types';
import { getContrast, includesUtilityClass } from '@/modules/ui/utils';

export interface IProps {
  text?: string;
  color?: string;
  textColor?: string;
  clickable?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  clickable: true,
  textColor: undefined,
  color: undefined,
  text: undefined,
});

defineEmits(['click']);

function getClassNames(attrClasses: any) {
  const textContrast = props.color ? getContrast(props.color) : 'white';

  return [
    'badge inline-block leading-3 overflow-hidden rounded select-none',
    {
      'cursor-pointer': props.clickable,
      [textContrast]: true,
      'text-slate-900': textContrast === 'black',
      'text-slate-100': textContrast === 'white',
      'py-0.5': !includesUtilityClass(attrClasses, 'py'),
      'px-1.5': !includesUtilityClass(attrClasses, 'px'),
      'text-xs': !includesUtilityClass(attrClasses, 'text'),
    },
  ];
}

const styleObject = computed<StyleDefinition>(() => {
  let result: StyleDefinition = {};
  if (props.color) result['background-color'] = props.color;
  if (props.textColor) result['color'] = props.textColor;
  return result;
});

const { text } = toRefs(props);
</script>

<template>
  <span :class="getClassNames($attrs.class)" :style="styleObject" @click="$emit('click')">
    <small class="text-xs">
      <slot>{{ text }}</slot>
    </small>
  </span>
</template>

<style lang="postcss">
.badge-dark {
  color: var(--color-inverted);
}
.badge-light {
  color: #000000;
}
</style>
