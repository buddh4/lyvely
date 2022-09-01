<script lang="ts" setup>
import Dialog from '@/modules/ui/components/dialog/Dialog.vue';
import TopNavigation from '@/modules/ui/components/layout/TopNavigation.vue';
import MobileFooterNavigation from '@/modules/ui/components/layout/MobileFooterNavigation.vue';
import Sidebar from '@/modules/ui/components/layout/Sidebar.vue';
import { toRefs } from 'vue'
import { useGlobalDialogStore } from '@/modules/core/store/global.dialog.store';
import AriaLiveStatus from "@/modules/accessibility/components/AriaLiveStatus.vue";
import AppLoader from "@/modules/ui/components/loader/AppLoader.vue";

const { visible, icon, iconColor, iconClass, title, message,  } = toRefs(useGlobalDialogStore());

</script>

<template>

  <div class="flex items-stretch">
    <Sidebar id="sidebar" />

    <div class="overflow-hidden flex w-full min-h-screen flex-col">
      <div class="flex items-stretch flex-col h-screen">
        <TopNavigation />
        <router-view></router-view>
      </div>
    </div>

  </div>
  <MobileFooterNavigation />
  <AppLoader />
  <AriaLiveStatus />
  <Dialog v-model="visible" :icon="icon" :icon-color="iconColor" :icon-class="iconClass" :title="title" :message="message" />
</template>
