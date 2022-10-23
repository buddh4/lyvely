<script lang="ts" setup>
import { Size } from "@/modules/ui/types";
import ProfileTopNavigation from "./snippets/ProfileTopNavigation.vue";
import MainContainer from "@/modules/ui/components/layout/MainContainer.vue";

export interface IProps {
  width?: "xs" | "sm" | "lg" | "xl" | "full";
  // TODO: GUEST - check guest access config
  requireAuth?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  width: Size.LG,
  requireAuth: true,
});
</script>

<template>
  <profile-top-navigation />
  <main-container v-bind="props">
    <slot></slot>
  </main-container>
</template>

<style scoped></style>
