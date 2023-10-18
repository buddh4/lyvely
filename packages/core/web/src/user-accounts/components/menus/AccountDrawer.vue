<script lang="ts" setup>
import { useAccountStore } from '@/user-accounts/stores/account.store';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useAuthStore } from '@/auth/store/auth.store';
import { isMaxViewSize, useMenu } from '@/ui';
import { useNotificationStore } from '@/notifications/stores/notifications.store';
import NotificationDrawer from '@/notifications/components/NotificationDrawer.vue';
import { useSendInviteUsersStore } from '@/user-invitations/stores/send-invitations.store';
import { UserAvatar } from '@/users';
import { MENU_ACCOUNT_DRAWER } from '@/user-accounts';
import MenuEntry from '@/ui/components/MenuEntry.vue';

const accountStore = useAccountStore();
const notificationStore = useNotificationStore();

const authStore = useAuthStore();

function logout() {
  authStore.logout().then(() => location.reload());
}

const { showAccountDrawer } = storeToRefs(accountStore);
const { showNotificationDrawer, hasUpdates: hasNotificationUpdates } =
  storeToRefs(notificationStore);

const { enabledMenuEntries } = useMenu(MENU_ACCOUNT_DRAWER);

const menuItemClass =
  'block py-3 px-3 no-underline cursor-pointer flex no-wrap items-center h-12 menu-item text-main';
const accountDrawerButtonClass = computed(() => [
  'px-2 p-2 rounded-xl cursor-pointer cursor-pointer border inline-flex items-center justify-center w-11',
  { 'border-divide': showAccountDrawer.value },
  { 'border-transparent': !showAccountDrawer.value },
]);

const notificationDrawerButtonClass = computed(() => {
  return [
    'relative border rounded-xl inline-flex items-center justify-center h-10 w-11',
    { 'border-divide': showNotificationDrawer.value },
    { 'border-transparent': !showNotificationDrawer.value },
  ];
});

function onInvite() {
  useSendInviteUsersStore().showModal = true;
}

function onMenuItemClick() {
  if (isMaxViewSize('sm')) {
    showAccountDrawer.value = false;
  }
}
</script>

<template>
  <div id="account-menu" class="flex items-center justify-end score inline-block float-right">
    <ly-button
      :class="notificationDrawerButtonClass"
      @click="showNotificationDrawer = !showNotificationDrawer">
      <ly-icon name="bell" class="w-3.5" />
      <ly-update-indicator v-if="hasNotificationUpdates" />
    </ly-button>
    <div :class="accountDrawerButtonClass" @click="showAccountDrawer = !showAccountDrawer">
      <user-avatar />
    </div>
  </div>

  <notification-drawer />

  <ly-drawer id="account-drawer" v-model="showAccountDrawer" title="user-accounts.drawer.title">
    <nav>
      <ul>
        <li v-for="menuEntry in enabledMenuEntries" :key="menuEntry.id">
          <menu-entry
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
  @apply border-l-4 border-slate-200 dark:border-slate-600 text-highlight;
}

nav a.router-link-active {
  @apply border-l-4 border-pop text-highlight;
}
</style>
