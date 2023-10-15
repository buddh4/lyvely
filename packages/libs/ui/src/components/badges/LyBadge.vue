<script lang="ts" setup>
import { computed, CSSProperties } from 'vue';
import { getContrast, includesUtilityClass } from '@/helpers';
import { t, Translatable } from '@/i18n';

export interface IProps {
  text?: Translatable;
  color?: string;
  textColor?: string;
  clickable?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  text: '',
  color: undefined,
  clickable: true,
  textColor: undefined,
});

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

const styleObject = computed<CSSProperties>(() => {
  let result: CSSProperties = {};
  if (props.color) result['background-color'] = props.color;
  if (props.textColor) result['color'] = props.textColor;
  return result;
});
</script>

<template>
  <span :class="getClassNames($attrs.class)" :style="styleObject">
    <small class="text-xs">
      <slot>{{ t(text) }}</slot>
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
