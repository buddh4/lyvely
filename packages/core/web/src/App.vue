<script lang="ts" setup>
import { usePageStore, STACK_MAIN } from '@/ui';
import {
  getLayout,
  resolveComponentRegistration,
  LyAppLoader,
  LyDialog,
  LyComponentStack,
} from '@lyvely/ui';
import { useGlobalDialogStore } from '@/core';
import AriaLiveStatus from '@/accessibility/components/AriaLiveStatus.vue';
import { useRouter } from 'vue-router';
import { watch, ref, computed, toRefs } from 'vue';
import { storeToRefs } from 'pinia';

const { visible, icon, iconColor, iconClass, title, message, buttonType } =
  toRefs(useGlobalDialogStore());

const layout = ref<string | undefined>();
const router = useRouter();
const { showAppLoader } = storeToRefs(usePageStore());

watch(router.currentRoute, (to) => {
  layout.value = to.meta?.layout;
});

const layoutDefinition = computed<{ component: any; props: any } | undefined>(() => {
  if (!layout.value) return undefined;
  const layoutDefinition = getLayout(layout.value?.toLowerCase());
  if (!layoutDefinition) return undefined;

  return {
    component: resolveComponentRegistration(layoutDefinition.component),
    props: layoutDefinition.props || {},
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

  <ly-component-stack :id="STACK_MAIN" />

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
</template>
