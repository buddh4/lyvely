<script lang="ts" setup>
import { RouteLocationRaw } from 'vue-router';
import { t, Translatable } from '@/i18n';
import {IMenuEntry} from "./interfaces";
import {computed} from "vue";

export interface IProps {
  to?: RouteLocationRaw;
  entry?: IMenuEntry;
  text?: Translatable;
}

const props = withDefaults(defineProps<IProps>(), {
  text: undefined,
});

const toRoute = computed(() => {
  return props.to || props.entry?.to;
});


const menuLabel = computed(() => {
  return props.text || props.entry?.text;
});
</script>

<template>
  <ly-button :route="toRoute" @click="entry?.click" :data-id="$attrs['data-id'] || entry?.id" role="tab" class="secondary outlined grow px-1 py-1">
    <template #default="{ active }">
      <slot :active="active">
        <template v-if="menuLabel">
          {{ t(menuLabel) }}
        </template>
      </slot>
    </template>
  </ly-button>
</template>

<style scoped></style>
