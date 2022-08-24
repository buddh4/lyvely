<script lang="ts" setup>
import Icon from '@/modules/ui/components/icon/Icon.vue';
import { useAuthStore } from '@/modules/user/store/auth.store';
import { computed, ref, toRefs, watch } from 'vue';
import { RouteLocation } from 'vue-router';
import { translate } from "@/i18n";
import { useProfileStore } from "@/modules/profile/stores/profile.store";
import { usePageStore } from "@/modules/core/store/page.store";

interface MenuItem {
  to?: Partial<RouteLocation> | string;
  click?: {(): void},
  icon: string;
  label: string;
}

const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);
const sidebar = ref<HTMLElement|null>(null);

const menuItems: MenuItem[] = [
  {
    to: { name: 'Activities' },
    icon: 'activity',
    label: 'activities.labels.main_nav'
  },
  {
    to: { name: 'Journal' },
    icon: 'journal',
    label: 'journals.labels.main_nav'
  },
  {
    to: { name: 'Statistics' },
    icon: 'statistics',
    label: 'statistics.labels.main_nav'
  },
  {
    to: { name: 'Tags' },
    icon: 'tags',
    label: 'tags.labels.main_nav'
  },
  {
    click: () => authStore.logout().then(() => location.reload()),
    icon: 'logout',
    label: 'users.labels.logout'
  }
];

const menuItemClasses = ['block py-3 px-3 no-underline cursor-pointer'];

const { toggleDark } = usePageStore();
const { showSidebar, isDark } = toRefs(usePageStore());

watch(showSidebar, () => {
  if(showSidebar.value) {
    setMinNavMargin('0px');
  } else {
    setMinNavMargin('-260px');
  }
});

function getMainNavMargin(): string {
  return sidebar.value ? window.getComputedStyle(sidebar.value).marginLeft : '0px';
}

function setMinNavMargin(val: string) {
  if(sidebar.value) {
    sidebar.value.style.marginLeft = val;
  }
}

const ariaLabel = computed(() => translate('profile.aria.sidebar', {profile: useProfileStore()?.profile?.name}))
</script>

<template>
  <nav v-if="isAuthenticated" id="sidebar" ref="sidebar" class="sidebar" :aria-label="ariaLabel">
    <div class="h-screen sticky top-0 left-0 flex-col flex-wrap justify-start content-start items-start">
      <div>
        <a class="sidebar-brand">
          <Icon name="lyvely" class="fill-current text-lyvely mr-2 " /> <img class="lyvely-logo-text" alt="Lyvely Logo" src="/images/logo_white_bold.svg" />
        </a>
      </div>

      <ul class="nav flex-column">
        <li>
          <template v-for="menuItem in menuItems" :key="menuItem.label">
            <a v-if="menuItem.click" :class="menuItemClasses" @click="menuItem.click">
              <Icon :name="menuItem.icon" class="fill-current mr-2 opacity-50" />
              {{ $t(menuItem.label) }}
            </a>
            <router-link v-else :class="menuItemClasses" :to="menuItem.to">
              <Icon :name="menuItem.icon" class="fill-current mr-2 opacity-50" />
              {{ $t(menuItem.label) }}
            </router-link>
          </template>
        </li>
      </ul>

      <button class="inline-flex justify-center border border-white rounded py-1 px-2 mx-4 my-4" @click="toggleDark()">
        <Icon v-if="isDark" name="light-mode"/>
        <Icon v-else name="dark-mode"/>
      </button>
    </div>
  </nav>
</template>

<style scoped lang="postcss">
.lyvely-logo-text {
  height: 20px;
}

.sidebar {
  @apply bg-sidebar;
  min-width: 260px;
  max-width: 260px;
  transition: margin-left 0.35s ease-in-out, left 0.35s ease-in-out, margin-right 0.35s ease-in-out,
    right 0.35s ease-in-out;
  direction: ltr;
}

.sidebar-brand {
  @apply flex items-center no-underline text-base font-extrabold uppercase tracking-wider h-12 px-3;
}

.sidebar a {
  border-left: 4px solid transparent;
  color: var(--color-fg-sidebar);
}

.sidebar .nav a.router-link-active {
  font-weight: 700;
  border-left: 4px solid var(--color-highlight);
}

.sidebar .nav a.router-link-active .icon {
  opacity: 1;
}

@media (max-width: 991.98px) {
  .sidebar {
    margin-left: -260px;
  }
}
</style>
