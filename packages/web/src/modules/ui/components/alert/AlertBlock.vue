<script lang="ts" setup>
import { computed, useSlots } from "vue";

interface IProps {
  message?: string;
  hide?: boolean;
  type?: "danger" | "info" | "warning";
}

const props = withDefaults(defineProps<IProps>(), {
  message: undefined,
  hide: undefined,
  type: "danger",
});

const cssClass = [
  "flex items-center border px-4 py-3 rounded relative mb-1",
  { "border-danger text-danger": props.type === "danger" },
  { "border-info text-dimmed": props.type === "info" },
  { "border-warning text-warning": props.type === "warning" },
];

const isActive = computed(() => {
  return !!useSlots().default || props.message?.length;
});
</script>

<template>
  <div v-if="isActive" :class="cssClass">
    <span class="text-sm">
      <slot>
        {{ $t(message) }}
      </slot>
    </span>
  </div>
</template>

<style lang="postcss">
@import "../../styles/alerts.css";
</style>
