<script lang="ts" setup>
import { computed, Ref, ref } from 'vue';
import { watchMaxSize, isMaxViewSize, LyMenuEntry } from '@lyvely/ui';
import { usePageStore } from '@/ui';
import { translate } from '@/i18n';
import { useProfileStore } from '@/profiles/stores';
import imageUrl from '@/assets/logo_white_bold.svg';
import { UseSwipeDirection, useSwipe } from '@vueuse/core';
import { useProfileMenu } from '@/profiles/composables';
import { MENU_PROFILE_DRAWER } from '@/profiles/profile.constants';
import ProfileAvatar from '../ProfileAvatar.vue';
import { storeToRefs } from 'pinia';
//import LegalLinks from '@/legal/components/LegalLinks.vue';

const pageStore = usePageStore();
const appDrawer = ref<HTMLElement>() as Ref<HTMLElement>;
const { profile } = storeToRefs(useProfileStore());

const { enabledMenuEntries } = useProfileMenu(MENU_PROFILE_DRAWER);

const { toggleSidebar } = pageStore;
const { showSidebar } = storeToRefs(pageStore);

const isSmallView = ref(isMaxViewSize('sm'));
watchMaxSize('sm', (value) => {
  isSmallView.value = value;
});

const showLabels = computed(() => showSidebar.value);

const ariaLabel = computed(() =>
  translate('profiles.aria.sidebar', {
    profile: useProfileStore().profile!.name,
  }),
);

function onMenuItemClick() {
  if (isMaxViewSize('sm')) showSidebar.value = true;
}

function onSwipeEnd(direction: UseSwipeDirection) {
  if (showSidebar.value && direction === 'left') toggleSidebar();
  if (!showSidebar.value && direction === 'right') toggleSidebar();
}

const appDrawerOverlay = ref<HTMLElement>() as Ref<HTMLElement>;
const { direction } = useSwipe(appDrawer, {
  onSwipeEnd() {
    onSwipeEnd(direction.value!);
  },
});
const { direction: overlayDirection } = useSwipe(appDrawerOverlay, {
  onSwipeEnd() {
    onSwipeEnd(overlayDirection.value!);
  },
});
</script>

<template>
  <transition name="fade-fast">
    <div
      v-if="showSidebar"
      id="app-drawer-overlay"
      ref="appDrawerOverlay"
      class="fixed md:hidden bg-black opacity-50 inset-0 z-40"
      @click="toggleSidebar"></div>
  </transition>
  <nav
    id="app-drawer"
    ref="appDrawer"
    :class="['will-change-transform z-50 overflow-hidden', { toggled: !showSidebar }]"
    :aria-label="ariaLabel">
    <div class="flex flex-col flex-wrap items-stretch content-start h-screen-s">
      <div class="px-3 py-2 w-full">
        <a
          class="flex gap-2 items-center no-underline font-extrabold uppercase tracking-wider h-10 cursor-pointer"
          @click="toggleSidebar">
          <ly-icon name="lyvely" class="fill-current text-lyvely w-5" />
          <transition name="fade">
            <img v-if="showLabels" class="lyvely-logo-text" alt="Lyvely Logo" :src="imageUrl" />
          </transition>
        </a>
      </div>

      <div class="flex-grow w-full">
        <ul data-id="profile-drawer" class="nav flex-column">
          <li class="mb-1">
            <div class="bg-slate-800 mx-1 rounded">
              <div
                class="flex text-sm gap-2 items-center h-12 select-none px-3"
                @click="toggleSidebar">
                <profile-avatar :border="false" />
                <transition name="fade">
                  <span v-if="showLabels" class="truncate no-underline">{{ profile!.name }}</span>
                </transition>
              </div>
            </div>
          </li>
          <li v-if="profile!.archived" class="mb-1 px-1">
            <ly-alert type="warning" :icon="true" text="common.archived" />
          </li>
          <li v-for="menuEntry in enabledMenuEntries" :key="menuEntry.id">
            <ly-menu-entry
              text-class="truncate text-sm"
              :entry="menuEntry"
              :show-labels="showLabels"
              icon-class="w-5"
              class="flex gap-2 select-none items-center h-12 px-3 cursor-pointer"
              @click="onMenuItemClick" />
          </li>
        </ul>
      </div>

      <transition name="fade">
        <div v-if="showSidebar" class="footer shrink-0 flex justify-center px-2 py-4 w-full">
          <!-- legal-links /-->
        </div>
      </transition>
    </div>
  </nav>
</template>

<style lang="postcss">
.lyvely-logo-text {
  height: 20px;
}

.footer {
  background-color: rgba(255, 255, 255, 5%);
}

#app-drawer .footer,
#app-drawer .footer a {
  color: rgba(255, 255, 255, 30%);
}

#app-drawer .icon {
  width: 24px;
}

#app-drawer .footer a:hover {
  color: rgba(255, 255, 255, 80%);
}

#app-drawer {
  @apply bg-sidebar text-sidebar;
  min-width: 260px;
  max-width: 260px;
  will-change: min-width, max-width;
  transition: all 0.35s ease-in-out;
  direction: ltr;
}

#app-drawer a {
  @apply text-sidebar;
  border-left: 4px solid transparent;
}

#app-drawer .nav a .icon {
  @apply fill-current opacity-50;
  border-left: 4px solid transparent;
}

#app-drawer .nav a.router-link-active {
  @apply font-bold border-l-4 border-pop;
}

#app-drawer .nav a:hover:not(.router-link-active) {
  @apply border-l-4 border-slate-600;
}

#app-drawer .nav a.router-link-active .icon {
  opacity: 1;
}

#app-drawer.toggled {
  min-width: 60px;
  max-width: 60px;
}

#app-drawer {
  @apply bg-slate-900 z-40;
}

@media (max-width: 767px) {
  #app-drawer {
    min-width: 260px;
    max-width: 260px;
    margin-left: 0;
  }

  #app-drawer.toggled {
    min-width: 260px;
    max-width: 260px;
    margin-left: -260px;
  }
}
.fade-fast-leave-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-active {
  transition: opacity 2s ease;
}

.fade-fast-enter-active {
  transition: opacity 0.2s ease;
}

.fade-fast-enter-from,
.fade-fast-leave-to,
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
