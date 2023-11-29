<script lang="ts" setup>
import { computed, DefineComponent, resolveDynamicComponent } from 'vue';

interface IProps {
  if: boolean;
  tag?: string | DefineComponent;
}

const props = withDefaults(defineProps<IProps>(), {
  tag: 'div',
});

const wrapper = computed(() => {
  if (typeof props.tag === 'string') {
    return props.tag.length ? props.tag : 'div';
  }

  return resolveDynamicComponent(props.tag);
});
</script>

<template>
  <component :is="wrapper" v-if="props.if">
    <slot />
  </component>
  <template v-else>
    <slot />
  </template>
</template>
