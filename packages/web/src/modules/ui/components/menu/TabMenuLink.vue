<script lang="ts" setup>
import { RouteRecord } from "vue-router";
interface IProps {
  route: RouteRecord;
  ariaControls: string;
  labelKey?: string;
}

defineProps<IProps>();
</script>

<template>
  <ly-button
    :route="route"
    role="tab"
    class="secondary outlined grow px-1 py-1"
    :aria-controls="ariaControls"
  >
    <slot>{{ $t(labelKey) }}</slot>
  </ly-button>
</template>

<style scoped></style>
