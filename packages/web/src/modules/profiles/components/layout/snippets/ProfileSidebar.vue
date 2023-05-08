<script lang="ts" setup>
import { useAuthStore } from '@/modules/auth/store/auth.store';
import { computed, ref, toRefs, watch } from 'vue';
import { RouteLocationRaw } from 'vue-router';
import { translate } from '@/i18n';
import { useProfileStore } from '@/modules/profiles/stores/profile.store';
import { usePageStore } from '@/modules/core/store/page.store';
import { watchMaxSize, isMaxViewSize } from '@/util/media';
import { isMultiUserProfile } from '@lyvely/common';
import imageUrl from '@/assets/logo_white_bold.svg';
import { useActivityStore } from '@/modules/activities/store/activity.store';
import { storeToRefs } from 'pinia';

interface IMenuItem {
  to?: RouteLocationRaw | string;
  click?: { (): void };
  icon: string;
  label: string;
  condition?: () => boolean;
}

const pageStore = usePageStore();
const authStore = useAuthStore();
const profileStore = useProfileStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);
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
      {
        to: { name: 'Journals' },
        icon: 'journal',
        label: 'journals.labels.main_nav',
      },
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
        label: 'profiles.users.label',
        condition: () => isMultiUserProfile(profileStore.profile),
      },
      {
        to: { name: 'ProfileSettings' },
        icon: 'settings',
        label: 'profiles.settings.label',
      },
    ] as IMenuItem[],
);

const menuItemClasses = ['block py-3 px-3 no-underline cursor-pointer'];

const { toggleSidebar } = pageStore;
const { showSidebar } = toRefs(pageStore);

watch(showSidebar, () => {
  if (showSidebar.value) {
    sidebar.value?.classList.remove('toggled');
  } else {
    sidebar.value?.classList.add('toggled');
  }
});

const isSmallView = ref(isMaxViewSize('sm'));
watchMaxSize('sm', (value) => {
  isSmallView.value = value;
});

const showLabels = computed(() => isSmallView.value || showSidebar.value);

const ariaLabel = computed(() =>
  translate('profiles.aria.sidebar', {
    profile: useProfileStore()?.profile?.name,
  }),
);

function onMenuItemClick(item: IMenuItem) {
  if (item.click) item.click();
  if (isMaxViewSize('sm')) {
    // Note on small devices the value is reversed, since the nav is initialized a bit ugly...
    showSidebar.value = true;
  }
}
</script>

<template>
  <nav v-if="isAuthenticated" id="sidebar" ref="sidebar" class="sidebar" :aria-label="ariaLabel">
    <div
      class="h-screen fix-h-screen sticky top-0 left-0 flex-col flex-wrap justify-start content-start items-start">
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

      <ul id="profile-navigation" class="nav flex-column">
        <li>
          <template v-for="menuItem in menuItems" :key="menuItem.label">
            <template v-if="!menuItem.condition || menuItem.condition()">
              <a
                v-if="menuItem.click"
                :class="menuItemClasses"
                class="flex no-wrap items-center h-12 select-none"
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
                :class="menuItemClasses"
                class="flex no-wrap items-center h-12 select-none"
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
  </nav>
</template>

<style scoped lang="postcss">
.lyvely-logo-text {
  height: 20px;
}

.sidebar.toggled {
  min-width: 60px;
  max-width: 60px;
}

.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-active {
  transition: opacity 2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.sidebar {
  min-width: 260px;
  max-width: 260px;
  transition: all 0.35s ease-in-out;
  direction: ltr;
}

@media (max-width: 767px) {
  .sidebar {
    min-width: 260px;
    max-width: 260px;
    margin-left: -260px;
  }

  .sidebar.toggled {
    min-width: 260px;
    max-width: 260px;
    margin-left: 0;
  }
}
</style>
