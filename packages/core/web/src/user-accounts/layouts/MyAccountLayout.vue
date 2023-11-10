<script lang="ts" setup>
import MyAccountHeader from '@/user-accounts/components/MyAccountHeader.vue';
import { useAccountStore } from '@/user-accounts/stores/account.store';
import { isMaxViewSize } from '@lyvely/ui';

const accountStore = useAccountStore();
if (!isMaxViewSize('sm')) {
  accountStore.showAccountDrawer = true;
}
</script>

<template>
  <suspense>
    <my-account-header />
  </suspense>
  <router-view></router-view>
</template>

<style scoped></style>
