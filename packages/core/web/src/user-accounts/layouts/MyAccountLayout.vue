<script lang="ts" setup>
import MyAccountHeader from '@/user-account/components/MyAccountHeader.vue';
import { useAccountStore } from '@/user-account/stores/account.store';
import { isMaxViewSize } from '@/ui';

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
