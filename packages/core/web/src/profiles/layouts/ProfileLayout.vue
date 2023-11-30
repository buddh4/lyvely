<script lang="ts" setup>
import { Size, LyComponentStack, isFormField } from '@lyvely/ui';
import ProfileDrawer from '../components/menus/ProfileDrawer.vue';
import MainProfileContainer from '../components/MainProfileContainer.vue';
import MobileFooterMenu from '../components/menus/MobileFooterMenu.vue';
import { computed, Ref, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { usePageStore } from '@/ui';
import { useSwipe } from '@vueuse/core';
import { useUserAccountStore } from '@/user-account';
import { STACK_PROFILE_LAYOUT } from '@/profiles/profile.constants';

const pageStore = usePageStore();
const accountStore = useUserAccountStore();

const { toggleSidebar } = pageStore;
const { showAccountDrawer } = storeToRefs(accountStore);

const { showMobileFooter, showSidebar, noSwipe } = storeToRefs(pageStore);
const root = ref<HTMLElement>() as Ref<HTMLElement>;

export interface IProps {
  containerWidth?: 'xs' | 'sm' | 'lg' | 'xl' | 'full';
  padding?: string;
  margin?: string;
  requireAuth?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  containerWidth: Size.LG,
  requireAuth: true,
  padding: undefined,
  margin: undefined,
});

const containerProps = computed(() => ({ width: props.containerWidth }));

let isScrolling = false;

window.addEventListener('scroll', () => {
  isScrolling = true;
});

window.addEventListener('touchend', () => {
  isScrolling = false;
});

const { direction } = useSwipe(root, {
  onSwipeEnd(e: TouchEvent) {
    // Closing swipe gestures are handled within the drawer components
    const target = e.target as HTMLElement;
    const noSwipeElement = target.closest('.no-swipe') || isFormField(target);
    if (
      noSwipeElement ||
      noSwipe.value ||
      isScrolling ||
      showSidebar.value ||
      showAccountDrawer.value
    )
      return;

    if (direction.value === 'right') toggleSidebar();
    if (direction.value === 'left') showAccountDrawer.value = true;
  },
});
</script>

<template>
  <profile-drawer />
  <div ref="root" data-id="layout-profile" class="overflow-hidden flex w-full h-screen-s flex-col">
    <div class="flex items-stretch flex-col h-screen-s">
      <main-profile-container v-bind="containerProps">
        <slot>
          <router-view></router-view>
        </slot>
      </main-profile-container>
      <mobile-footer-menu :state="showMobileFooter" />
    </div>
  </div>

  <ly-component-stack :id="STACK_PROFILE_LAYOUT" />
</template>

<style scoped></style>
