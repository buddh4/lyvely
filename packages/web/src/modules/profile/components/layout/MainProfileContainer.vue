<script lang="ts" setup>
import { Size } from "@/modules/ui/types";
import ProfileTopNavigation from "@/modules/profile/components/layout/ProfileTopNavigation.vue";
import MainContainer from "@/modules/ui/components/layout/MainContainer.vue";

interface Props {
  width?: 'xs'|'sm'|'lg'|'xl'|'full',
  // TODO: GUEST - check guest access config
  requireAuth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  width: Size.LG,
  requireAuth: true
});

</script>

<template>
  <ProfileTopNavigation />
  <MainContainer v-bind="props" >
    <slot></slot>
  </MainContainer>
</template>

<style scoped>

</style>
