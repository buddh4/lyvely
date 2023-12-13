<script lang="ts" setup>
import ProfileBreadcrumb from '@/profiles/components/menus/ProfileBreadcrumb.vue';
import ProfileComboButton from '@/profiles/components/menus/ProfileComboButton.vue';
import { STACK_PROFILE_TOP_RIGHT_NAVIGATION } from '@/profiles/profile.constants';
import { LyComponentStack } from '@lyvely/ui';
</script>

<template>
  <nav
    id="top-navigation"
    class="flex items-center justify-between no-wrap bg-main p-0.5 px-2 z-30 overflow-visible"
    :aria-label="$t('layout.aria.top-nav')">
    <div class="w-1/3">
      <profile-combo-button />
    </div>

    <div class="w-1/3 flex justify-center">
      <profile-breadcrumb />
    </div>

    <div class="w-1/3">
      <ly-component-stack
        :id="STACK_PROFILE_TOP_RIGHT_NAVIGATION"
        class="flex flex-row-reverse items-center justify-end score float-right gap-1" />
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
