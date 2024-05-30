<script lang="ts" setup>
import { useUserAccountStore } from '@/user-account/stores';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { isMaxViewSize, LyMenuEntry, useMenu } from '@lyvely/ui';
import { UserAvatar } from '@/users';
import { MENU_ACCOUNT_DRAWER } from '@/user-account/user-account.constants';

const accountStore = useUserAccountStore();

const { showAccountDrawer } = storeToRefs(accountStore);

const { enabledMenuEntries } = useMenu(MENU_ACCOUNT_DRAWER);

const menuItemClass =
  'block py-3 px-3 no-underline cursor-pointer flex no-wrap items-center h-12 menu-item text-main';
const accountDrawerButtonClass = computed(() => [
  'px-2 p-2 rounded-xl cursor-pointer cursor-pointer border inline-flex items-center justify-center w-11',
  { 'border-divide': showAccountDrawer.value },
  { 'border-transparent': !showAccountDrawer.value },
]);

function onMenuItemClick() {
  if (isMaxViewSize('sm')) {
    showAccountDrawer.value = false;
  }
}
</script>

<template>
  <div class="flex items-center justify-end">
    <button
      :class="accountDrawerButtonClass"
      data-id="btn-account-drawer"
      aria-controls="btn-account-drawer"
      @click="showAccountDrawer = !showAccountDrawer">
      <user-avatar data-id="account-drawer-avatar" />
    </button>
  </div>

  <ly-drawer id="account-drawer" v-model="showAccountDrawer" title="user-account.drawer.title">
    <nav>
      <ul>
        <li v-for="menuEntry in enabledMenuEntries" :key="menuEntry.id">
          <ly-menu-entry
            :entry="menuEntry"
            :class="menuItemClass"
            icon-class="mr-2 opacity-80"
            @click="onMenuItemClick" />
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
  @apply border-l-4 border-slate-200 text-highlight dark:border-slate-600;
}

nav a.router-link-active {
  @apply border-l-4 border-pop text-highlight;
}
</style>
