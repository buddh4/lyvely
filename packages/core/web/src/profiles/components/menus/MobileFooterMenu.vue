<script lang="ts" setup>
import { useProfileMenu } from '@/profiles/composables';
import { MENU_PROFILE_MOBILE_FOOTER } from '@/profiles/profile.constants';
import { type IClickMenuEntry, LyMenuEntry, sortBySortOrder } from '@lyvely/ui';
import { computed, ref } from 'vue';
import { useProfileStore } from '@/profiles/stores';
import { useRouter } from 'vue-router';
import { isNotNil } from '@lyvely/common/src';
import { isNil } from 'lodash';
import { storeToRefs } from 'pinia';
import { usePageStore } from '@/ui';
import { useSwipe } from '@vueuse/core';

const { showMobileDrawer, showMobileFooter } = storeToRefs(usePageStore());
const root = ref<HTMLElement>();

const openMenuEntry: IClickMenuEntry = {
  id: 'open-menu',
  moduleId: 'profiles',
  click: () => {
    showMobileDrawer.value = true;
  },
  icon: 'dots-v',
};

const { enabledMenuEntries } = useProfileMenu(MENU_PROFILE_MOBILE_FOOTER);

const currentRoute = useRouter().currentRoute;

const { direction } = useSwipe(root, {
  onSwipeEnd(e: TouchEvent) {
    if (!showMobileDrawer.value && direction.value === 'up') {
      e.stopPropagation();
      showMobileDrawer.value = true;
    }
  },
});

const latestEntries = computed(() => {
  const latestFeatures = useProfileStore().getLatestFeatures();
  return [...enabledMenuEntries.value]
    .sort((a, b) => {
      if (isNil(a.feature) && isNil(b.feature)) return sortBySortOrder(a, b);
      if (isNotNil(a.feature) && currentRoute.value.meta.feature === a.feature) return -1;
      if (isNotNil(b.feature) && currentRoute.value.meta.feature === b.feature) return 1;
      return latestFeatures.indexOf(a.feature!) - latestFeatures.indexOf(b.feature!);
    })
    .splice(0, 3);
});
</script>

<template>
  <transition name="slide-fade">
    <nav
      v-if="showMobileFooter"
      id="page-footer-nav"
      ref="root"
      class="footer h- relative w-full shrink-0 overflow-visible bg-main py-1 shadow md:hidden">
      <div class="z-20 flex justify-center">
        <div class="mr-auto flex-shrink-0 px-4">
          <ly-menu-entry :entry="openMenuEntry" />
        </div>
        <div class="navbar-nav justify-content-center flex grow flex-row gap-7">
          <ly-menu-entry
            v-for="entry in latestEntries"
            :key="entry.id"
            :entry="entry"
            :show-labels="false"
            class="nav-link" />
        </div>
        <div class="invisible ml-auto flex-shrink-0 px-4">
          <ly-menu-entry :entry="openMenuEntry" />
        </div>
      </div>
    </nav>
  </transition>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.navbar-nav .icon {
  display: inline-block;
  width: 1.1em;
  height: 1.1em;
  stroke-width: 0;
  stroke: currentColor;
  fill: currentColor;
  margin: 5px;
}

#page-footer-nav {
  width: 100dvw;
}

.navbar-nav {
  flex-direction: row;
  justify-content: center;
}

.navbar-nav .nav-link {
  padding: 0;
}

.nav-link.router-link-active {
  border-bottom: 2px solid var(--color-pop);
}

.slide-fade-enter-active {
  transition-property: transform, opacity;
  transition-duration: 0.3s;
  transition-timing-function: ease-out;
}

.slide-fade-leave-active {
  transition-property: transform, opacity;
  transition-duration: 0.3s;
  transition-timing-function: ease-in-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(280px);
  opacity: 0.9;
}
</style>
