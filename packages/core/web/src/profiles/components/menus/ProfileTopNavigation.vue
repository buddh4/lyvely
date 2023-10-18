<script lang="ts" setup>
import ProfileBreadcrumb from '@/profiles/components/menus/ProfileBreadcrumb.vue';
import ProfileComboButton from '@/profiles/components/menus/ProfileComboButton.vue';
import AccountDrawer from '@/user-accounts/components/menus/AccountDrawer.vue';
</script>

<template>
  <nav
    id="top-navigation"
    class="flex items-center justify-between no-wrap overflow-hidden p-0.5 px-2 z-40 shadow dark:shadow-slate-900 overflow-visible"
    :aria-label="$t('layout.aria.top-nav')">
    <div class="w-1/3">
      <profile-combo-button />
    </div>

    <div class="w-1/3 flex justify-center">
      <profile-breadcrumb />
    </div>

    <div class="w-1/3">
      <account-drawer />
    </div>
  </nav>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@media (max-width: 767px) {
  #top-navigation {
    min-width: 100vw;
  }
}
</style>
