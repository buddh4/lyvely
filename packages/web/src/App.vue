<script lang="ts" setup>
import Dialog from '@/modules/ui/components/dialog/Dialog.vue';
import MobileFooterNavigation from '@/modules/ui/components/layout/MobileFooterNavigation.vue';
import { toRefs } from 'vue'
import { useGlobalDialogStore } from '@/modules/core/store/global.dialog.store';
import AriaLiveStatus from "@/modules/accessibility/components/AriaLiveStatus.vue";
import ProfileViewLayout from "@/modules/profile/components/layout/ProfileViewLayout.vue";
import AppLoader from "@/modules/ui/components/loader/AppLoader.vue";
import { useRouter } from "vue-router";
import { watch, ref, computed } from "vue";

const { visible, icon, iconColor, iconClass, title, message,  } = toRefs(useGlobalDialogStore());

const layout = ref<string|undefined>();
const router = useRouter();

watch(router.currentRoute, (to, from) => {
  layout.value = to.meta?.layout
});

const layoutComponent = computed(() => {
  if(!layout.value) {
    return null;
  }

  return {
    'profile': ProfileViewLayout
  }[layout.value];
})

</script>

<template>

  <div class="flex items-stretch">
    <Component v-if="layoutComponent" :is="layoutComponent">

    </Component>
    <template v-else>
      <router-view></router-view>
    </template>

  </div>
  <MobileFooterNavigation />
  <AppLoader />
  <AriaLiveStatus />
  <Dialog v-model="visible" :icon="icon" :icon-color="iconColor" :icon-class="iconClass" :title="title" :message="message" />
</template>
