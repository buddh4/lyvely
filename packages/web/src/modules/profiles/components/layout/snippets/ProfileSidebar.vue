<script lang="ts" setup>
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { computed, ref, toRefs, watch } from "vue";
import { RouteLocation } from "vue-router";
import { translate } from "@/i18n";
import { useProfileStore } from "@/modules/profiles/stores/profile.store";
import { usePageStore } from "@/modules/core/store/page.store";
import { watchMaxSize, isMaxViewSize } from "@/util/media";
import { isMultiUserProfile } from "@lyvely/common";

interface IMenuItem {
  to?: Partial<RouteLocation> | string;
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

// TODO: make modules register menu items here...

const menuItems: IMenuItem[] = [
  {
    to: { name: "Habits" },
    icon: "activity",
    label: "activities.labels.main_nav",
  },
  /*{
    to: {name: 'Journal'},
    icon: 'journal',
    label: 'journals.labels.main_nav'
  },*/
  {
    to: { name: "Statistics" },
    icon: "statistics",
    label: "statistics.labels.main_nav",
  },
  {
    to: { name: "Tags" },
    icon: "tags",
    label: "tags.labels.main_nav",
  },
  {
    to: { name: "ProfileUsers" },
    icon: "users",
    label: "profile.users.label",
    condition: () => isMultiUserProfile(profileStore.profile),
  },
  {
    to: { name: "ProfileSettings" },
    icon: "settings",
    label: "profile.settings.label",
  },
  {
    click: () => authStore.logout().then(() => location.reload()),
    icon: "logout",
    label: "auth.logout",
  },
];

const menuItemClasses = ["block py-3 px-3 no-underline cursor-pointer"];

const { toggleSidebar } = pageStore;
const { showSidebar } = toRefs(pageStore);

watch(showSidebar, () => {
  if (showSidebar.value) {
    sidebar.value?.classList.remove("toggled");
  } else {
    sidebar.value?.classList.add("toggled");
  }
});

const isSmallView = ref(isMaxViewSize("sm"));
watchMaxSize("sm", (value) => {
  isSmallView.value = value;
});

const showLabels = computed(() => isSmallView.value || showSidebar.value);

const ariaLabel = computed(() =>
  translate("profile.aria.sidebar", {
    profile: useProfileStore()?.profile?.name,
  })
);
</script>

<template>
  <nav
    v-if="isAuthenticated"
    id="sidebar"
    ref="sidebar"
    class="sidebar"
    :aria-label="ariaLabel"
  >
    <div
      class="h-screen sticky top-0 left-0 flex-col flex-wrap justify-start content-start items-start"
    >
      <div class="py-2">
        <a
          class="flex items-center no-underline font-extrabold uppercase tracking-wider h-12 px-3 cursor-pointer"
          @click="toggleSidebar"
        >
          <ly-icon name="lyvely" class="fill-current text-lyvely mr-2 w-5" />
          <transition name="fade">
            <img
              v-if="showLabels"
              class="lyvely-logo-text"
              alt="Lyvely Logo"
              src="/images/logo_white_bold.svg"
            />
          </transition>
        </a>
      </div>

      <ul class="nav flex-column">
        <li>
          <template v-for="menuItem in menuItems" :key="menuItem.label">
            <template v-if="!menuItem.condition || menuItem.condition()">
              <a
                v-if="menuItem.click"
                :class="menuItemClasses"
                class="flex no-wrap items-center h-12"
                @click="menuItem.click"
              >
                <ly-icon :name="menuItem.icon" class="w-5" />
                <transition name="fade">
                  <span v-if="showLabels" class="menu-item">
                    {{ $t(menuItem.label) }}
                  </span>
                </transition>
              </a>
              <router-link
                v-else
                :class="menuItemClasses"
                class="flex no-wrap items-center h-12"
                :to="menuItem.to"
              >
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
