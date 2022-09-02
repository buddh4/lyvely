<script lang="ts" setup>
import { Size } from "@/modules/ui/types";
import ProfileSidebar from "@/modules/profile/components/layout/ProfileSidebar.vue";
import MainProfileContainer from "@/modules/profile/components/layout/MainProfileContainer.vue";
import { computed } from 'vue';

interface Props {
  containerWidth?: 'xs'|'sm'|'lg'|'xl'|'full',
  // TODO: GUEST - check guest access config
  requireAuth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  containerWidth: Size.LG,
  requireAuth: true
});

const containerProps = computed(() => ({
  width: props.containerWidth
}))

</script>

<template>
  <ProfileSidebar />
  <div class="overflow-hidden flex w-full min-h-screen flex-col">
    <div class="flex items-stretch flex-col h-screen">
      <MainProfileContainer v-bind="containerProps">
        <slot>
          <router-view></router-view>
        </slot>
      </MainProfileContainer>
    </div>
  </div>
</template>

<style scoped>

</style>
