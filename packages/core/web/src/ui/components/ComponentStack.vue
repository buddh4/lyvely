<script setup lang="ts">
import { resolveComponentRegistration } from '@/ui/helpers';
import { getComponentStackEntries } from '@/ui/component-stack';
import { computed, ComputedRef, Ref } from 'vue';

interface IProps {
  id: string;
}

const props = defineProps<IProps>();

const componentDefinitions = computed<
  {
    id: string;
    component: any;
    props: any;
    condition?: Ref<boolean> | ComputedRef<boolean> | boolean;
  }[]
>(() => {
  const definitions = getComponentStackEntries(props.id);
  const result = [];
  for (const definition of definitions.value) {
    result.push({
      id: definition.id,
      component: resolveComponentRegistration(definition.component),
      props: definition.props || {},
      condition: typeof definition.condition === 'undefined' ? true : definition.condition,
    });
  }
  return result;
});
</script>

<template>
  <div>
    <template v-for="definition in componentDefinitions" :key="definition.id">
      <Component
        :is="definition.component"
        v-if="definition.condition"
        v-bind="definition.props"></Component>
    </template>
  </div>
</template>

<style scoped></style>
