<script lang="ts" setup>
import MyAccountHeader from '@/user-account/components/MyAccountHeader.vue';
import { useUserAccountStore } from '@/user-account/stores/user-account.store';
import { isMaxViewSize } from '@lyvely/ui';

const accountStore = useUserAccountStore();
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
