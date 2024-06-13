<script lang="ts" setup>
import { HTMLAttributes, computed } from 'vue';
import { parseInt } from 'lodash';
import LyCheckbox from './LyCheckbox.vue';
import { useBaseInputSetup } from '@/components/forms/BaseInput';

export interface IProps {
  max?: number;
  selection?: number;
  min?: number;
  optimal?: number;
  disabled?: boolean;
  inputStyle?: HTMLAttributes['style'];
  single?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  selection: 0,
  optimal: 0,
  min: 0,
  max: 1,
  inputStyle: undefined,
  disabled: false,
  single: false,
});

const emit = defineEmits(['update:selection']);

function isChecked(unitIndex: number) {
  return unitIndex <= props.selection;
}

function cssClasses(unitIndex: number) {
  let result = ['border rounded mr-1 ring-0'];

  if (!isChecked(unitIndex) && unitIndex <= props.min) {
    result.push('warning');
  } else if (isChecked(unitIndex) && props.selection < props.min) {
    result.push('warning');
  } else if (!isChecked(unitIndex) && unitIndex <= props.optimal) {
    result.push('success');
  } else if (isChecked(unitIndex) && props.selection >= props.optimal) {
    result.push('success');
  }

  return result;
}

const count = computed(() => Math.max(props.max, props.selection));

const values = computed(() => {
  const result = [];
  for (let i = 1; i <= count.value; i++) {
    if (i <= props.selection) {
      result.push(i);
    }
  }
  return result;
});

const { dataId } = useBaseInputSetup(props, emit);

function updateValue(checked: boolean, value: string) {
  let intValue = parseInt(value);
  emit('update:selection', checked ? intValue : --intValue);
}
</script>

<template>
  <fieldset class="flex flex-row-reverse">
    <template v-if="!single">
      <div v-for="unit in count" :key="unit">
        <ly-checkbox
          v-model="values"
          :data-id="dataId + '-' + unit"
          :disabled="props.disabled"
          :input-class="cssClasses(unit)"
          :input-style="inputStyle"
          :value="unit.toString()"
          @change="updateValue" />
      </div>
    </template>
    <template v-else>
      <ly-checkbox
        model-value="1"
        :data-id="dataId"
        :checked="!!props.selection"
        :input-class="cssClasses(0)"
        :input-style="inputStyle"
        @change="updateValue" />
    </template>
  </fieldset>
</template>

<style scoped></style>
