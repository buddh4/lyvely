<script lang="ts" setup>
import { computed, toRefs } from 'vue';
import { CssClassDefinition, StyleDefinition } from '@/util/component.types';

interface Props {
  text?: string,
  color?: string,
  textColor?: string,
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  clickable: true,
  textColor: undefined,
  color: undefined,
  text: undefined,
});

defineEmits(['click']);

const classNames = computed<CssClassDefinition>(() =>
  ['badge inline-block px-1.5 py-0.5 text-xs leading-3 rounded select-none', {'cursor-pointer': props.clickable}]);

const styleObject = computed<StyleDefinition>(() => {
  let result: StyleDefinition = {};
  if (props.color) result['background-color'] = props.color;
  if (props.textColor) result['color'] = props.textColor;
  return result;
});

const { text } = toRefs(props);
</script>

<template>
  <span :class="classNames" :style="styleObject" @click="$emit('click')">
    <small>
        <slot>{{ text }}</slot>
    </small>
  </span>
</template>

<style lang="postcss">
.badge {
  color: var(--color-inverted);
}
</style>
