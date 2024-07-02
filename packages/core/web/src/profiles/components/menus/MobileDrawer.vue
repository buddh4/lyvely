<script lang="ts" setup>
import { useProfileMenu } from '@/profiles/composables';
import { MENU_PROFILE_MOBILE_FOOTER } from '@/profiles/profile.constants';
import { LyMenuEntry } from '@lyvely/ui';
import { ref } from 'vue';
import { onClickOutside, useSwipe } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { usePageStore } from '@/ui';

const { showMobileDrawer } = storeToRefs(usePageStore());
const mobileNavDrawer = ref<HTMLElement>();

onClickOutside(mobileNavDrawer, () => (showMobileDrawer.value = false));

const { enabledMenuEntries } = useProfileMenu(MENU_PROFILE_MOBILE_FOOTER);

const { direction } = useSwipe(mobileNavDrawer, {
  onSwipeEnd(e: TouchEvent) {
    if (showMobileDrawer.value && direction.value === 'down') {
      e.stopPropagation();
      showMobileDrawer.value = false;
    }
  },
});
</script>

<template>
  <transition name="fade-fast">
    <div
      v-if="showMobileDrawer"
      id="app-drawer-overlay"
      ref="overlay"
      class="fixed inset-0 z-40 bg-black opacity-50 md:hidden"
      @mousedown="showMobileDrawer = false"
      @touchstart="showMobileDrawer = false"></div>
  </transition>
  <transition
    enter-active-class="animate__animated animate__slideInUp"
    leave-active-class="animate__animated animate__faster animate__slideOutDown">
    <nav
      v-if="showMobileDrawer"
      ref="mobileNavDrawer"
      data-id="mobile-drawer"
      class="mobileNavDrawer absolute bottom-1 left-0 z-50 w-full rounded-t-2xl bg-main">
      <div>
        <div class="flex items-center rounded-t-sm px-4 pb-3 pt-4">
          <h1 class="font-bold">Profile Menu</h1>
          <ly-button
            class="float-right ml-auto border-none px-2 py-0.5 align-middle font-bold"
            @click="showMobileDrawer = false">
            <ly-icon name="arrow-down" class="text-main" />
          </ly-button>
        </div>
        <ly-divided-list>
          <ly-menu-entry
            v-for="entry in enabledMenuEntries"
            :key="entry.id"
            :entry="entry"
            class="no-wrap menu-item flex h-12 cursor-pointer items-center gap-2 px-3 py-3 text-main no-underline"
            @click="showMobileDrawer = false" />
        </ly-divided-list>
      </div>
    </nav>
  </transition>
</template>

<style scoped>
.mobileNavDrawer {
  max-height: 75svh;
}

.mobileNavDrawer .router-link-active {
  border-left: 4px solid rgb(var(--color-pop) / 1);
}
</style>
