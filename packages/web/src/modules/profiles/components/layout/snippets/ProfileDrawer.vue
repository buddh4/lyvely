<script lang="ts" setup>
import { computed, Ref, ref, toRefs, watch } from 'vue';
import { RouteLocationRaw } from 'vue-router';
import { translate } from '@/i18n';
import { useProfileStore } from '@/modules/profiles/stores/profile.store';
import { usePageStore } from '@/modules/core/store/page.store';
import { watchMaxSize, isMaxViewSize } from '@/util/media';
import { isMultiUserProfile } from '@lyvely/common';
import imageUrl from '@/assets/logo_white_bold.svg';
import { useActivityStore } from '@/modules/activities/store/activity.store';
import { storeToRefs } from 'pinia';
import { UseSwipeDirection, useSwipe } from '@vueuse/core';
import LegalLinks from '@/modules/legal/components/LegalLinks.vue';

interface IMenuItem {
  to?: RouteLocationRaw | string;
  click?: { (): void };
  icon: string;
  label: string;
  condition?: () => boolean;
}

const pageStore = usePageStore();
const profileStore = useProfileStore();
const appDrawer = ref<HTMLElement>() as Ref<HTMLElement>;
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
      {
        to: { name: 'Journals' },
        icon: 'journal',
        label: 'journals.labels.main_nav',
      },
      /*{
        to: { name: 'Statistics' },
        icon: 'statistics',
        label: 'statistics.labels.main_nav',
      },*/
      {
        to: { name: 'Tags' },
        icon: 'tags',
        label: 'tags.labels.main_nav',
      },
      {
        to: { name: 'ProfileUsers' },
        icon: 'users',
        label: 'profiles.users.label',
        condition: () => isMultiUserProfile(profileStore.profile!),
      },
      /*{
        to: { name: 'ProfileSettings' },
        icon: 'settings',
        label: 'profiles.settings.label',
      },*/
    ] as IMenuItem[],
);

const { toggleSidebar } = pageStore;
const { showSidebar } = toRefs(pageStore);

const isSmallView = ref(isMaxViewSize('sm'));
watchMaxSize('sm', (value) => {
  isSmallView.value = value;
});

const showLabels = computed(() => showSidebar.value);

const ariaLabel = computed(() =>
  translate('profiles.aria.sidebar', {
    profile: useProfileStore()?.profile?.name,
  }),
);

function onMenuItemClick(item: IMenuItem) {
  if (item.click) item.click();
  if (isMaxViewSize('sm')) showSidebar.value = true;
}

function onSwipeEnd(direction: UseSwipeDirection) {
  if (showSidebar.value && direction === 'left') toggleSidebar();
  if (!showSidebar.value && direction === 'right') toggleSidebar();
}

const appDrawerOverlay = ref<HTMLElement>() as Ref<HTMLElement>;
const { direction } = useSwipe(appDrawer, {
  onSwipeEnd(e: TouchEvent) {
    onSwipeEnd(direction.value!);
  },
});
const { direction: overlayDirection } = useSwipe(appDrawerOverlay, {
  onSwipeEnd(e: TouchEvent) {
    onSwipeEnd(overlayDirection.value!);
  },
});
</script>

<template>
  <nav id="app-drawer" ref="appDrawer" :class="[{ toggled: !showSidebar }]" :aria-label="ariaLabel">
    <div class="flex flex-col flex-wrap items-stretch content-start h-screen-s">
      <div class="py-2">
        <a
          class="flex items-center no-underline font-extrabold uppercase tracking-wider h-12 px-3 cursor-pointer"
          @click="toggleSidebar">
          <ly-icon name="lyvely" class="fill-current text-lyvely mr-2 w-5" />
          <transition name="fade">
            <img v-if="showLabels" class="lyvely-logo-text" alt="Lyvely Logo" :src="imageUrl" />
          </transition>
        </a>
      </div>

      <div class="flex-grow">
        <ul id="profile-navigation" class="nav flex-column">
          <li>
            <template v-for="menuItem in menuItems" :key="menuItem.label">
              <template v-if="!menuItem.condition || menuItem.condition()">
                <a
                  v-if="menuItem.click"
                  class="flex no-wrap items-center h-12 select-none block py-3 px-3 no-underline cursor-pointer"
                  @click="onMenuItemClick(menuItem)">
                  <ly-icon :name="menuItem.icon" class="w-5" />
                  <transition name="fade">
                    <span v-if="showLabels" class="menu-item">
                      {{ $t(menuItem.label) }}
                    </span>
                  </transition>
                </a>
                <router-link
                  v-if="menuItem.to"
                  class="flex no-wrap items-center h-12 select-none block py-3 px-3 no-underline cursor-pointer"
                  :to="menuItem.to"
                  @click="onMenuItemClick(menuItem)">
                  <ly-icon :name="menuItem.icon" class="w-5" />
                  <transition name="fade">
                    <span v-if="showLabels" class="menu-item">
                      {{ $t(menuItem.label) }}
                    </span>
                  </transition>
                </router-link>
              </template>
            </template>
          </li>
        </ul>
      </div>

      <transition name="fade">
        <div v-if="showSidebar" class="legal-links shrink-0 flex justify-center px-2 py-4 w-full">
          <legal-links />
        </div>
      </transition>
    </div>
  </nav>
  <transition name="fade-fast">
    <div
      v-if="showSidebar"
      id="app-drawer-overlay"
      ref="appDrawerOverlay"
      class="fixed md:hidden bg-black opacity-50 inset-0 z-0"
      @click="toggleSidebar"></div>
  </transition>
</template>

<style lang="postcss">
.lyvely-logo-text {
  height: 20px;
}

.legal-links {
  background-color: rgba(255, 255, 255, 5%);
}

#app-drawer .legal-links,
#app-drawer .legal-links a {
  color: rgba(255, 255, 255, 30%);
}

#app-drawer .legal-links a:hover {
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

#app-drawer.toggled {
  min-width: 60px;
  max-width: 60px;
}

#app-drawer-overlay {
  z-index: 99;
}
#app-drawer {
  @apply bg-slate-900;
  z-index: 100;
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
