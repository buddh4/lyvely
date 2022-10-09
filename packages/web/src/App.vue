<script lang="ts" setup>
import DialogWindow from "@/modules/ui/components/dialog/DialogWindow.vue";
import MobileFooterNavigation from "@/modules/ui/components/layout/MobileFooterNavigation.vue";
import { useGlobalDialogStore } from "@/modules/core/store/global.dialog.store";
import AriaLiveStatus from "@/modules/accessibility/components/AriaLiveStatus.vue";
import ProfileViewLayout from "@/modules/profiles/components/layout/ProfileViewLayout.vue";
import AppLoader from "@/modules/ui/components/loader/AppLoader.vue";
import { useRouter } from "vue-router";
import { watch, ref, computed, toRefs } from "vue";

const { visible, icon, iconColor, iconClass, title, message, buttonType } = toRefs(
  useGlobalDialogStore()
);

const layout = ref<string | undefined>();
const router = useRouter();

watch(router.currentRoute, (to) => {
  layout.value = to.meta?.layout;
});

const layoutComponent = computed(() => {
  if (!layout.value) {
    return null;
  }

  return {
    profile: ProfileViewLayout,
  }[layout.value];
});
</script>

<template>
  <div class="flex items-stretch">
    <Component :is="layoutComponent" v-if="layoutComponent"></Component>
    <template v-else>
      <router-view></router-view>
    </template>
  </div>
  <MobileFooterNavigation />
  <AppLoader />
  <AriaLiveStatus />
  <dialog-window
    v-model="visible"
    :icon="icon"
    :icon-color="iconColor"
    :icon-class="iconClass"
    :title="title"
    :button-type="buttonType"
    :message="message"
  />
</template>
