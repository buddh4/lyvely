<script lang="ts" setup>
import { computed, ref, toRefs, watch } from 'vue';
import { RouteLocationRaw } from 'vue-router';
import { translate } from '@/i18n';
import { useProfileStore } from '@/modules/profiles/stores/profile.store';
import { usePageStore } from '@/modules/core/store/page.store';
import { isMultiUserProfile } from '@lyvely/common';
import imageUrl from '@/assets/logo_white_bold.svg';
import { useActivityStore } from '@/modules/activities/store/activity.store';
import { storeToRefs } from 'pinia';
import { SwipeDirection, useSwipe } from '@vueuse/core';
import { isMaxViewSize } from '@/util';

interface IMenuItem {
  to?: RouteLocationRaw | string;
  click?: { (): void };
  icon: string;
  label: string;
  condition?: () => boolean;
}

const pageStore = usePageStore();
const profileStore = useProfileStore();
const sidebar = ref<HTMLElement | null>(null);
const { activeView } = storeToRefs(useActivityStore());

// TODO: make modules register menu items here...

const menuItems = computed(
  () =>
    [
      {
        to: { name: 'stream' },
        icon: 'stream',
        label: 'stream.labels.main_nav',
      },
      {
        to: { name: activeView.value },
        icon: 'activity',
        label: 'activities.labels.main_nav',
      },
      /*{
    to: {name: 'Journal'},
    icon: 'journal',
    label: 'journals.labels.main_nav'
  },*/
      {
        to: { name: 'Statistics' },
        icon: 'statistics',
        label: 'statistics.labels.main_nav',
      },
      {
        to: { name: 'Tags' },
        icon: 'tags',
        label: 'tags.labels.main_nav',
      },
      {
        to: { name: 'ProfileUsers' },
        icon: 'users',
        label: 'profile.users.label',
        condition: () => isMultiUserProfile(profileStore.profile),
      },
      {
        to: { name: 'ProfileSettings' },
        icon: 'settings',
        label: 'profile.settings.label',
      },
    ] as IMenuItem[],
);

const menuItemClasses = ['block py-3 px-3 no-underline cursor-pointer animate-label'];

const { toggleSidebar } = pageStore;
const { showSidebar } = toRefs(pageStore);

watch(
  showSidebar,
  (newValue) => {
    if (newValue) {
      document.documentElement.style.setProperty(
        '--app-layout-left-margin',
        'var(--app-drawer-width)',
      );
    } else {
      document.documentElement.style.setProperty(
        '--app-layout-left-margin',
        'var(--app-drawer-toggled-width)',
      );
    }
  },
  { immediate: true },
);

function onSwipeEnd(direction: SwipeDirection) {
  if (showSidebar.value && direction === SwipeDirection.LEFT) toggleSidebar();
  if (!showSidebar.value && direction === SwipeDirection.RIGHT) toggleSidebar();
}
const appDrawerRoot = ref<HTMLElement>();
const appDrawerOverlay = ref<HTMLElement>();
const { direction } = useSwipe(appDrawerRoot, {
  onSwipeEnd(e: TouchEvent) {
    onSwipeEnd(direction.value!);
  },
});
const { direction: overlayDirection } = useSwipe(appDrawerOverlay, {
  onSwipeEnd(e: TouchEvent) {
    onSwipeEnd(overlayDirection.value!);
  },
});

const showLabels = computed(() => showSidebar.value);

const ariaLabel = computed(() =>
  translate('profile.aria.sidebar', {
    profile: useProfileStore()?.profile?.name,
  }),
);

function onMenuItemClick(item: IMenuItem) {
  if (item.click) item.click();
  if (isMaxViewSize('sm')) showSidebar.value = false;
}
</script>

<template>
  <nav
    id="app-drawer"
    ref="appDrawerRoot"
    :class="['sidebar', { toggled: !showSidebar }]"
    :aria-label="ariaLabel">
    <div
      class="h-screen fix-h-screen sticky top-0 left-0 flex-col flex-wrap justify-start content-start items-start">
      <div class="py-2">
        <a
          class="flex items-center no-underline font-extrabold uppercase tracking-wider h-12 px-3 cursor-pointer"
          @click="toggleSidebar">
          <ly-icon name="lyvely" class="fill-current text-lyvely mr-2 w-5" />
          <img
            v-if="showLabels"
            class="lyvely-logo-text animate-label"
            alt="Lyvely Logo"
            :src="imageUrl" />
        </a>
      </div>

      <ul id="profile-navigation" class="nav flex-column">
        <li>
          <template v-for="menuItem in menuItems" :key="menuItem.label">
            <template v-if="!menuItem.condition || menuItem.condition()">
              <a
                v-if="menuItem.click"
                :class="menuItemClasses"
                class="flex no-wrap items-center h-12"
                @click="onMenuItemClick(menuItem)">
                <ly-icon :name="menuItem.icon" class="w-5" />

                <span v-if="showLabels" class="menu-item">
                  {{ $t(menuItem.label) }}
                </span>
              </a>
              <router-link
                v-if="menuItem.to"
                :class="menuItemClasses"
                class="flex no-wrap items-center h-12"
                :to="menuItem.to"
                @click="onMenuItemClick(menuItem)">
                <ly-icon :name="menuItem.icon" class="w-5" />

                <span v-if="showLabels" class="menu-item">
                  {{ $t(menuItem.label) }}
                </span>
              </router-link>
            </template>
          </template>
        </li>
      </ul>
    </div>
  </nav>
  <transition name="fade">
    <div
      v-if="showSidebar"
      id="app-drawer-overlay"
      ref="appDrawerOverlay"
      class="fixed md:hidden bg-black opacity-50 inset-0 z-0"
      @click="toggleSidebar"></div>
  </transition>
</template>

<style scoped lang="postcss">
.lyvely-logo-text {
  height: 20px;
}

#app-drawer.toggled {
  width: var(--app-drawer-toggled-width);
}

#app-drawer {
  position: fixed;
  overflow: hidden;
  top: 0;
  left: 0;
  width: var(--app-drawer-width);
  direction: ltr;
}

#app-drawer-overlay {
  z-index: 99;
}

#app-drawer {
  @apply bg-slate-900;
  z-index: 100;
}

#app-drawer a {
  @apply text-slate-100;
  border-left: 4px solid transparent;
}

#app-drawer .nav a .icon {
  @apply fill-current mr-2 opacity-50;
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

@media (max-width: 767px) {
  #app-drawer {
    transition: width 0.35s ease;
  }
}

.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-active {
  transition: opacity 0.35s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
