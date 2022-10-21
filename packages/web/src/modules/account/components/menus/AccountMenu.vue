<script lang="ts" setup>
import { useAccountStore } from "@/modules/account/stores/account.store";
import { storeToRefs } from "pinia";
import { computed, toRefs } from "vue";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { usePageStore } from "@/modules/core/store/page.store";

const accountStore = useAccountStore();
const authStore = useAuthStore();
const pageStore = usePageStore();

function logout() {
  authStore.logout().then(() => location.reload());
}

const { showAccountDrawer } = storeToRefs(accountStore);

const menuItemClass =
  "block py-3 px-3 no-underline cursor-pointer flex no-wrap items-center h-12 menu-item";
const accountDrawerButtonClass = computed(() => [
  "px-2 p-2 rounded-xl flex justify-center items-center gap-2 cursor-pointer text-sm cursor-pointer",
  { "border border-divide": showAccountDrawer.value },
  { "border border-transparent": !showAccountDrawer.value },
]);

const { toggleDark } = pageStore;
const { isDark } = toRefs(pageStore);
</script>

<template>
  <div class="flex items-center justify-end score inline-block float-right">
    <ly-button>
      <ly-icon name="bell" class="w-3.5" />
    </ly-button>
    <div
      :class="accountDrawerButtonClass"
      @click="showAccountDrawer = !showAccountDrawer"
    >
      <ly-user-avatar />
    </div>
  </div>

  <ly-drawer
    id="account-drawer"
    v-model="showAccountDrawer"
    title="account.drawer.title"
  >
    <nav>
      <ul>
        <li>
          <router-link :to="{ name: 'MyAccountInfo' }" :class="menuItemClass">
            <ly-icon name="account" />
            {{ $t("account.drawer.myAccount") }}
          </router-link>
        </li>
        <li>
          <router-link to="/" :class="menuItemClass">
            <ly-icon name="security" />
            {{ $t("account.drawer.security") }}
          </router-link>
        </li>
        <li>
          <a :class="menuItemClass" @click="toggleDark()">
            <ly-icon v-if="isDark" name="light-mode" />
            <ly-icon v-else name="dark-mode" />
            <span v-if="isDark">{{ $t("page.toLightMode") }}</span>
            <span v-else>{{ $t("page.toDarkMode") }}</span>
          </a>
        </li>
        <li>
          <a :class="menuItemClass" @click="logout">
            <ly-icon name="logout" />
            {{ $t("users.logout") }}
          </a>
        </li>
      </ul>
    </nav>
  </ly-drawer>
</template>

<style scoped>
nav a {
  @apply border-l-4 border-transparent;
}

nav a:hover:not(.router-link-active) {
  @apply border-l-4 border-slate-200 dark:border-slate-600;
}

nav a .icon {
  @apply mr-2 opacity-80;
}

nav a.router-link-active {
  @apply border-l-4 border-pop;
}
</style>
