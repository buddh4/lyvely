<script lang="ts" setup>
import { RouteRecord } from "vue-router";
export interface IProps {
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
    <slot>
      <template v-if="labelKey">
        {{ $t(labelKey) }}
      </template>
    </slot>
  </ly-button>
</template>

<style scoped></style>
