<script lang="ts" setup>
import { Size } from '@lyvely/ui';
import ProfileDrawer from '../components/menus/ProfileDrawer.vue';
import MainProfileContainer from '../components/MainProfileContainer.vue';
import CreateProfileModal from '../components/modals/CreateProfileModal.vue';
import MobileFooterMenu from '../components/menus/MobileFooterMenu.vue';
import { computed, defineAsyncComponent, Ref, ref } from 'vue';
import { storeToRefs } from 'pinia';
import InviteUsersModal from '@/user-invitations/components/modals/InviteUsersModal.vue';
import { useIntroductionTourStore } from '@/help/stores/introduction-tour.store';

import HelpModal from '@/help/components/HelpModal.vue';
import { CreateOrEditContentModal } from '@/content';
import { usePageStore, isFormField } from '@/ui';
import { useSwipe } from '@vueuse/core';
import { useAccountStore } from '@/account';
import ComponentStack from '@/ui/components/ComponentStack.vue';
import { STACK_PROFILE_LAYOUT } from '@/profiles/profile.constants';

const pageStore = usePageStore();
const accountStore = useAccountStore();

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

const { active: showIntroductionTour } = storeToRefs(useIntroductionTourStore());

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

const IntroductionTour = defineAsyncComponent(
  () => import('@/help/components/IntroductionTour.vue'),
);
</script>

<template>
  <profile-drawer />
  <div ref="root" class="overflow-hidden flex w-full h-screen-s flex-col">
    <div class="flex items-stretch flex-col h-screen-s">
      <main-profile-container v-bind="containerProps">
        <slot>
          <router-view></router-view>
        </slot>
      </main-profile-container>
      <mobile-footer-menu :state="showMobileFooter" />
    </div>
  </div>

  <create-profile-modal />

  <create-or-edit-content-modal />

  <!-- Todo: We should not depend on user-invitation and other modules here, maybe add a component stack widget here ProfileLayoutAdditions -->
  <invite-users-modal />
  <introduction-tour v-if="showIntroductionTour" />
  <help-modal />
</template>

<style scoped></style>
