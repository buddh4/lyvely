<script lang="ts" setup>
import { Size } from '@/modules/ui/types';
import ProfileDrawer from './snippets/ProfileDrawer.vue';
import MainProfileContainer from './MainProfileContainer.vue';
import { computed, defineAsyncComponent, Ref, ref } from 'vue';
import { storeToRefs } from 'pinia';
import CreateProfileModal from '../modals/CreateProfileModal.vue';
import InviteUsersModal from '../../../invitations/components/modals/InviteUsersModal.vue';
import { useIntroductionTourStore } from '@/modules/help/stores/introduction-tour.store';
import HelpModal from '@/modules/help/components/HelpModal.vue';

import CreateOrEditContentModal from '@/modules/content-stream/components/CreateOrEditContentModal.vue';
import MobileFotterMenu from '@/modules/profiles/components/menus/MobileFotterMenu.vue';
import { usePageStore } from '@/modules/core/store/page.store';
import { useSwipe } from '@vueuse/core';
import { useAccountStore } from '@/modules/account/stores/account.store';

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
    const noSwipeElement = (<HTMLElement>e.target).closest('.no-swipe');
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
  () => import('@/modules/help/components/IntroductionTour.vue'),
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
      <mobile-fotter-menu :state="showMobileFooter" />
    </div>
  </div>

  <introduction-tour v-if="showIntroductionTour" />

  <help-modal />

  <create-profile-modal />

  <create-or-edit-content-modal />

  <invite-users-modal />
</template>

<style scoped></style>
