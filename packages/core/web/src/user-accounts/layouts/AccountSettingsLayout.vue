<script lang="ts" setup>
import { useAccountStore } from '@/user-accounts/stores/account.store';
import { isMaxViewSize, LyContentRoot } from '@lyvely/ui';
import AccountSettingsNavigation from '../components/menus/AccountSettingsNavigation.vue';

const accountStore = useAccountStore();
if (!isMaxViewSize('sm')) {
  accountStore.showAccountDrawer = true;
}
</script>

<template>
  <ly-content-root>
    <account-settings-navigation />
    <router-view></router-view>
  </ly-content-root>
</template>

<style scoped></style>
