<script lang="ts" setup>
import ProfileBreadcrumb from '@/profiles/components/menus/ProfileBreadcrumb.vue';
import ProfileComboButton from '@/profiles/components/menus/ProfileComboButton.vue';
import { STACK_PROFILE_TOP_RIGHT_NAVIGATION } from '@/profiles/profile.constants';
import { LyComponentStack } from '@lyvely/ui';
import { t } from '@/i18n';
</script>

<template>
  <nav
    id="top-navigation"
    class="no-wrap z-30 flex items-center justify-between overflow-visible bg-main p-0.5 px-2"
    :aria-label="t('layout.aria.top-nav')">
    <div class="w-1/3">
      <profile-combo-button />
    </div>

    <div class="flex w-1/3 justify-center">
      <profile-breadcrumb />
    </div>

    <div class="w-1/3">
      <ly-component-stack
        :id="STACK_PROFILE_TOP_RIGHT_NAVIGATION"
        class="score float-right flex flex-row-reverse items-center justify-end gap-1" />
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
