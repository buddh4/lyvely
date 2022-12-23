<script lang="ts" setup>
import { Size } from '@/modules/ui/types';
import ProfileTopNavigation from './snippets/ProfileTopNavigation.vue';
import MainContainer from '@/modules/ui/components/layout/MainContainer.vue';

export interface IProps {
  width?: 'xs' | 'sm' | 'lg' | 'xl' | 'full';
}

const props = withDefaults(defineProps<IProps>(), {
  width: Size.LG,
});
</script>

<template>
  <profile-top-navigation />
  <main-container v-bind="props">
    <slot></slot>
  </main-container>
</template>

<style scoped></style>
