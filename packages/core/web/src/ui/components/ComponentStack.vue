<script setup lang="ts">
import { resolveComponentRegistration } from '@/ui/helpers';
import { getComponentStackEntries } from '@/ui/component-stack';
import { computed } from 'vue';

interface IProps {
  id: string;
}

const props = defineProps<IProps>();

const components = computed<{ id: string; component: any; props: any }[]>(() => {
  const definitions = getComponentStackEntries(props.id);
  const result = [];
  for (const definition of definitions.value) {
    result.push({
      id: definition.id,
      component: resolveComponentRegistration(definition.component),
      props: definition.props || {},
    });
  }

  return result;
});
</script>

<template>
  <div>
    <template v-for="component in components" :key="component.id">
      <Component :is="component" v-bind="component.props"></Component>
    </template>
  </div>
</template>

<style scoped></style>
