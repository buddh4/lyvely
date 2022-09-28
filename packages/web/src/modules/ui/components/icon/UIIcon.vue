<script lang="ts" setup>
import { IconName, getIconByName } from "@/modules/ui/components/icon/Icons";
import { computed } from "vue";
import { StyleDefinition } from "@/util/component.types";
import { IconOptionsIF } from "@/modules/ui/types";
import { includesUtilityClass } from "@/modules/ui/utils";

interface IProps {
  name?: IconName;
  options?: IconOptionsIF;
}

const props = withDefaults(defineProps<IProps>(), {
  name: "",
  options: undefined,
});

const name = computed(() => props.name || props.options?.name || "");
const definition = getIconByName(name.value);
const styleObject = computed(
  (): StyleDefinition =>
    props.options?.fill ? { fill: props.options.fill } : {}
);

function getClassNames(attrClasses: any) {
  const result = {
    icon: true,
    "w-4": !includesUtilityClass(attrClasses, "w"),
    inline: true,
    [`icon-${name.value}`]: true,
  };

  if (props.options?.color) {
    result[props.options.color.toString()] = true;
  }

  return result;
}
</script>

<template>
  <svg
    v-if="definition"
    aria-hidden="true"
    :class="getClassNames($attrs.class)"
    :style="styleObject"
    :viewBox="definition.viewBox"
  >
    <path v-for="path in definition.paths" :key="path" :d="path"></path>
  </svg>
</template>

<style>
.icon {
  fill: currentColor;
}

.icon.success {
  fill: var(--color-success);
}

.icon.primary {
  fill: var(--color-primary);
}

.icon.secondary {
  fill: var(--color-secondary);
}

.icon.warning {
  fill: var(--color-warning);
}

.icon.danger {
  fill: var(--color-danger);
}

.icon.info {
  fill: var(--color-info);
}
</style>
