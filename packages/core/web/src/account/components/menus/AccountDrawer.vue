<script lang="ts" setup>
import { useAccountStore } from '@/account/stores/account.store';
import { storeToRefs } from 'pinia';
import { computed, toRefs } from 'vue';
import { useAuthStore } from '@/auth/store/auth.store';
import { usePageStore, isMaxViewSize } from '@/ui';
import { useHelpStore } from '@/help/stores/help.store';
import { useNotificationStore } from '@/notifications/stores/notifications.store';
import NotificationDrawer from '@/notifications/components/NotificationDrawer.vue';
import { useSendInviteUsersStore } from '@/user-invitations/stores/send-invitations.store';
import { UserAvatar } from '@/users';

const accountStore = useAccountStore();
const notificationStore = useNotificationStore();

const authStore = useAuthStore();
const pageStore = usePageStore();

function logout() {
  authStore.logout().then(() => location.reload());
}

const { showAccountDrawer } = storeToRefs(accountStore);
const { showNotificationDrawer, hasUpdates: hasNotificationUpdates } =
  storeToRefs(notificationStore);

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

function showHelp() {
  useHelpStore().setShowModal(true);
}

const { toggleDark } = pageStore;
const { isDark } = toRefs(pageStore);

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

  <ly-drawer id="account-drawer" v-model="showAccountDrawer" title="account.drawer.title">
    <nav>
      <ul>
        <!--li>
          <router-link
            :to="{ name: 'MyAccountInfo' }"
            :class="menuItemClass"
            draggable="false"
            @click="onMenuItemClick">
            <ly-icon name="account" />
            {{ $t('account.drawer.myAccount') }}
          </router-link>
        </li -->
        <!--li>
          <router-link to="/" :class="menuItemClass" draggable="false" @click="onMenuItemClick">
            <ly-icon name="security" />
            {{ $t('account.drawer.security') }}
          </router-link>
        </li -->
        <li>
          <a
            :class="menuItemClass"
            draggable="false"
            @click="
              showHelp();
              onMenuItemClick();
            ">
            <ly-icon name="help" />
            {{ $t('help.label') }}
          </a>
        </li>
        <li>
          <a
            :class="menuItemClass"
            draggable="false"
            @click="
              toggleDark();
              onMenuItemClick();
            ">
            <ly-icon v-if="isDark" name="light-mode" />
            <ly-icon v-else name="dark-mode" />
            <span v-if="isDark">{{ $t('page.toLightMode') }}</span>
            <span v-else>{{ $t('page.toDarkMode') }}</span>
          </a>
        </li>
        <li>
          <a
            :class="menuItemClass"
            draggable="false"
            @click="
              onInvite();
              onMenuItemClick();
            ">
            <ly-icon name="paper-plane" :auto-scale="true" />
            <span>{{ $t('invitations.account.title') }}</span>
          </a>
        </li>
        <li>
          <a :class="menuItemClass" draggable="false" @click="logout">
            <ly-icon name="logout" :auto-scale="true" />
            {{ $t('auth.logout') }}
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
  @apply border-l-4 border-slate-200 dark:border-slate-600 text-highlight;
}

nav a .icon {
  @apply mr-2 opacity-80;
}

nav a.router-link-active {
  @apply border-l-4 border-pop text-highlight;
}
</style>
