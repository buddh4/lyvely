<script lang="ts" setup>
import { Size } from '@lyvely/ui';
import ProfileTopNavigation from '../components/menus/ProfileTopNavigation.vue';
import { useProfileStore } from '@/profiles/stores';
import { storeToRefs } from 'pinia';

export interface IProps {
  width?: 'xs' | 'sm' | 'lg' | 'xl' | 'full';
}

const props = withDefaults(defineProps<IProps>(), {
  width: Size.LG,
});

const { profile } = storeToRefs(useProfileStore());
</script>

<template>
  <profile-top-navigation v-if="profile" :key="profile.id" />
  <ly-main-container v-if="profile" :key="profile.id" v-bind="props">
    <slot></slot>
  </ly-main-container>
</template>

<style scoped></style>
