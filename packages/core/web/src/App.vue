<script lang="ts" setup>
import { ReloadPrompt, useGlobalDialogStore, usePageStore } from '@/core';
import AriaLiveStatus from '@/accessibility/components/AriaLiveStatus.vue';
import ProfileLayout from '@/profiles/components/layout/ProfileLayout.vue';
import { LyAppLoader, LyDialog } from '@lyvely/ui';
import { useRouter } from 'vue-router';
import { watch, ref, computed, toRefs } from 'vue';
import { storeToRefs } from 'pinia';

const { visible, icon, iconColor, iconClass, title, message, buttonType } = toRefs(
  useGlobalDialogStore(),
);

const layout = ref<string | undefined>();
const router = useRouter();
const { showAppLoader } = storeToRefs(usePageStore());

watch(router.currentRoute, (to) => {
  layout.value = to.meta?.layout;
});

const layoutMap = new Map<string, { component: any; props: any }>();
layoutMap.set('profile', { component: ProfileLayout, props: {} });
layoutMap.set('profile-xl', { component: ProfileLayout, props: { containerWidth: 'xl' } });
layoutMap.set('profile-full', { component: ProfileLayout, props: { containerWidth: 'full' } });

const layoutDefinition = computed<{ component: any; props: any } | undefined>(() => {
  if (!layout.value) return undefined;
  const layoutDefinition = layoutMap.get(layout.value?.toLowerCase());
  if (!layoutDefinition) return undefined;

  return {
    component: layoutDefinition.component,
    props: layoutDefinition.props,
  };
});
</script>

<template>
  <div class="flex items-stretch">
    <Component
      :is="layoutDefinition.component"
      v-if="layoutDefinition"
      v-bind="layoutDefinition.props" />
    <template v-else>
      <router-view></router-view>
    </template>
  </div>
  <ly-app-loader v-model="showAppLoader" />
  <aria-live-status />
  <ly-dialog
    v-model="visible"
    :icon="icon"
    :icon-color="iconColor"
    :icon-class="iconClass"
    :title="title"
    :button-type="buttonType"
    :message="message" />
  <reload-prompt />
</template>
