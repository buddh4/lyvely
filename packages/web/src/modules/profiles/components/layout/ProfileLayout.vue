<script lang="ts" setup>
import { Size } from '@/modules/ui/types';
import ProfileSidebar from './snippets/ProfileSidebar.vue';
import MainProfileContainer from './MainProfileContainer.vue';
import { computed, defineAsyncComponent } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/modules/auth/store/auth.store';
import CreateProfileModal from '../modals/CreateProfileModal.vue';
import InviteUsersModal from '../modals/InviteUsersModal.vue';
import { useIntroductionTourStore } from '@/modules/help/stores/introduction-tour.store';
import HelpModal from '@/modules/help/components/HelpModal.vue';
import { useContentEditStore } from '@/modules/content/stores/content-edit.store';
import { useContentCreateStore } from '@/modules/content/stores/content-create.store';

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

const show = computed(() => (props.requireAuth ? useAuthStore().isAuthenticated : true));

const IntroductionTour = defineAsyncComponent(
  () => import('@/modules/help/components/IntroductionTour.vue'),
);

const {
  showCreateModal,
  createContentType,
  initOptions: createInitOptions,
  createModalComponent,
} = storeToRefs(useContentCreateStore());

const {
  showEditModal,
  editContent,
  initOptions: editInitOptions,
  editModalComponent,
} = storeToRefs(useContentEditStore());
</script>

<template>
  <profile-sidebar v-if="show" />
  <div v-if="show" class="overflow-hidden flex w-full min-h-screen fix-h-screen flex-col">
    <div class="flex items-stretch flex-col h-screen fix-h-screen">
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

  <template v-if="showEditModal">
    <component
      :is="editModalComponent"
      v-model="showEditModal"
      :content="editContent"
      :type="editContent.type"
      :init-options="editInitOptions" />
  </template>
  <template v-if="showCreateModal">
    <component
      :is="createModalComponent"
      v-model="showCreateModal"
      :type="createContentType"
      :init-options="createInitOptions" />
  </template>
</template>

<style scoped></style>
