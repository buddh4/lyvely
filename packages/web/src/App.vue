<script lang="ts" setup>
import DialogWindow from '@/modules/ui/components/dialog/DialogWindow.vue';
import MobileFooterNavigation from '@/modules/ui/components/layout/MobileFooterNavigation.vue';
import { useGlobalDialogStore } from '@/modules/core/store/global.dialog.store';
import AriaLiveStatus from '@/modules/accessibility/components/AriaLiveStatus.vue';
import ProfileLayout from '@/modules/profiles/components/layout/ProfileLayout.vue';
import AppLoader from '@/modules/ui/components/loader/AppLoader.vue';
import { useRouter } from 'vue-router';
import { watch, ref, computed, toRefs } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/modules/auth/store/auth.store';
import ReloadPrompt from '@/modules/core/components/ReloadPrompt.vue';

const { visible, icon, iconColor, iconClass, title, message, buttonType } = toRefs(
  useGlobalDialogStore(),
);

const layout = ref<string | undefined>();
const router = useRouter();
const { isAuthenticated } = storeToRefs(useAuthStore());

watch(router.currentRoute, (to) => {
  layout.value = to.meta?.layout;
});

const layoutMap = new Map<string, { component: any; props: any }>();
layoutMap.set('profile', { component: ProfileLayout, props: {} });
layoutMap.set('profile-xl', { component: ProfileLayout, props: { containerWidth: 'xl' } });
layoutMap.set('profile-full', { component: ProfileLayout, props: { containerWidth: 'full' } });

const layoutDefintion = computed<{ component: any; props: any } | undefined>(() => {
  if (!layout.value) return undefined;
  const layoutDefinition = layoutMap.get(layout.value?.toLowerCase());
  if (!layoutDefinition) return undefined;

  return {
    component: layoutDefinition.component,
    props: layoutDefinition.props,
  };
});

/* Fixes 100vh on mobile devices which do include address bar to the 100vh*/
function calculateVh() {
  document.documentElement.style.setProperty('--vh', window.innerHeight * 0.01 + 'px');
}
calculateVh();
window.addEventListener('resize', calculateVh);
window.addEventListener('orientationchange', calculateVh);
</script>

<template>
  <div class="flex items-stretch">
    <Component
      :is="layoutDefintion.component"
      v-if="layoutDefintion"
      v-bind="layoutDefintion.props" />
    <template v-else>
      <router-view></router-view>
    </template>
  </div>
  <mobile-footer-navigation v-if="isAuthenticated" />
  <app-loader />
  <aria-live-status />
  <dialog-window
    v-model="visible"
    :icon="icon"
    :icon-color="iconColor"
    :icon-class="iconClass"
    :title="title"
    :button-type="buttonType"
    :message="message" />
  <reload-prompt />
</template>
