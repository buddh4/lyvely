<script lang="ts" setup>
import { computed, withDefaults } from "vue";
import { parseInt } from "lodash";
import LyCheckbox from "@/modules/ui/components/form/CheckboxInput.vue";

interface Props {
  max: number;
  selection?: number;
  min?: number;
  optimal?: number;
  disabled?: boolean;
  single?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  selection: 0,
  optimal: 0,
  min: 0,
  disabled: false,
  single: false,
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

const values = computed(() => {
  const result = [];
  for (let i = 1; i <= count.value; i++) {
    if (i <= props.selection) {
      result.push(i);
    }
  }
  return result;
});

function updateValue(checked: boolean, value: string) {
  let intValue = parseInt(value);
  emit("update:selection", checked ? intValue : --intValue);
}
</script>

<template>
  <div class="flex flex-row-reverse">
    <template v-if="!single">
      <div v-for="unit in count" :key="unit">
        <ly-input-checkbox
          v-model="values"
          :disabled="props.disabled"
          :css-class="cssClasses(unit)"
          :value="unit"
          @change="updateValue"
        />
      </div>
    </template>
    <template v-else>
      <ly-input-checkbox
        :model-value="1"
        :checked="props.selection"
        :css-class="cssClasses(0)"
        @change="updateValue"
      />
    </template>
  </div>
</template>

<style scoped></style>
