<script setup lang="ts">
import { resolveComponentRegistration } from '@/helpers';
import { getComponentStackEntries } from './interfaces';
import { computed, ComputedRef, Ref } from 'vue';

interface IProps {
  id: string;
}

const props = defineProps<IProps>();

const componentDefinitions = computed<
  {
    id: string;
    modelValue?: boolean;
    component: any;
    props: any;
    on?: Record<string, (...args: any[]) => void>;
    condition?: Ref<boolean> | ComputedRef<boolean> | boolean;
  }[]
>(() => {
  const definitions = getComponentStackEntries(props.id);
  const result = [];
  for (const definition of definitions.value) {
    result.push({
      id: definition.id,
      modelValue: !!definition.props?.modelValue,
      component: resolveComponentRegistration(definition.component),
      props: definition.props || {},
      on: definition.on || {},
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
        v-bind="definition.props"
        v-on="definition.on"
        @update:model-value="(value: any) => { (definition.props.modelValue = value) }" />
    </template>
  </div>
</template>

<style scoped></style>
