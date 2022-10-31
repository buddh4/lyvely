<script lang="ts" setup>
import { Size } from '@/modules/ui/types';
import ProfileSidebar from './snippets/ProfileSidebar.vue';
import MainProfileContainer from './MainProfileContainer.vue';
import { computed, ref, defineAsyncComponent } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/modules/auth/store/auth.store';
import CreateProfileModal from '../modals/CreateProfileModal.vue';
import InviteUsersModal from '../modals/InviteUsersModal.vue';
import { useIntroductionTourStore } from '@/modules/help/stores/introduction-tour.store';
import HelpModal from '@/modules/help/components/HelpModal.vue';

export interface IProps {
  containerWidth?: 'xs' | 'sm' | 'lg' | 'xl' | 'full';
  requireAuth?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  containerWidth: Size.LG,
  requireAuth: true,
});

const { active: showIntroductionTour } = storeToRefs(useIntroductionTourStore());

const containerProps = computed(() => ({
  width: props.containerWidth,
}));

const show = computed(() => (props.requireAuth ? useAuthStore().isAuthenticated : true));

const IntroductionTour = defineAsyncComponent(() => import('@/modules/help/components/IntroductionTour.vue'));
</script>

<template>
  <profile-sidebar v-if="show" />
  <div v-if="show" class="overflow-hidden flex w-full min-h-screen flex-col">
    <div class="flex items-stretch flex-col h-screen">
      <main-profile-container v-bind="containerProps">
        <slot>
          <router-view></router-view>
        </slot>
      </main-profile-container>
    </div>
  </div>
  <introduction-tour v-if="showIntroductionTour" />
  <help-modal />
  <create-profile-modal />
  <invite-users-modal />
</template>

<style scoped></style>
