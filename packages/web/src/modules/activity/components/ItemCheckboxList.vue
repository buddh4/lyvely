<script lang="ts" setup>
import Checkbox from '@/modules/ui/components/form/Checkbox.vue';
import { computed, withDefaults } from 'vue';

interface Props {
  max: number,
  selection?: number,
  min?: number,
  optimal?: number,
  disabled?: boolean,
  single?: boolean,
}

const props = withDefaults(defineProps<Props>(), {
  selection: 0,
  optimal: 0,
  min: 0,
  disabled: false,
  single: false
});

const emit = defineEmits(["update:selection"]);

function isChecked(unitIndex: number) {
  return unitIndex <= props.selection;
}

function cssClasses(unitIndex: number) {
  let result = ["border rounded ml-1 ring-0"];

  if (!isChecked(unitIndex) && unitIndex <= props.min) {
    result.push("warning");
  } else if (isChecked(unitIndex) && props.selection < props.min) {
    result.push("warning");
  } else if (!isChecked(unitIndex) && unitIndex <= props.optimal) {
    result.push("success");
  } else if (isChecked(unitIndex) && props.selection >= props.optimal) {
    result.push("success");
  }

  return result;
}

const count = computed(() => Math.max(props.max, props.selection));

function updateValue(evt: any) {
  let value = parseInt(evt.target.value);
  emit("update:selection", evt.target.checked ? value : --value);
}
</script>

<template>
  <div class="flex flex-row-reverse">
    <template v-if="!props.single">
      <div v-for="unit in count" :key="unit">
        <Checkbox
          :disabled="props.disabled"
          :value="unit"
          :checked="unit <= props.selection"
          :css-class="cssClasses(unit)"
          @change="updateValue" />
      </div>
    </template>
    <template v-else>
      <Checkbox
        :disabled="props.disabled"
        :value="1"
        :checked="props.selection"
        :css-class="cssClasses(0)"
        @change="updateValue" />
    </template>
  </div>
</template>

<style scoped></style>
