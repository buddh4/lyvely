<script lang="ts" setup>
import MyAccountHeader from '@/modules/account/components/MyAccountHeader.vue';
import { useAccountStore } from '@/modules/account/stores/account.store';
import { isMaxViewSize } from '@/util';

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
