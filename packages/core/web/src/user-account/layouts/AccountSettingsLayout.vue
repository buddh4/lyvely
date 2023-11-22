<script lang="ts" setup>
import { useUserAccountStore } from '@/user-account/stores/user-account.store';
import { isMaxViewSize, LyContentRoot } from '@lyvely/ui';
import AccountSettingsNavigation from '../components/menus/AccountSettingsNavigation.vue';

const accountStore = useUserAccountStore();
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
