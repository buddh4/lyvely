<script lang="ts" setup></script>

<template>
  <ly-tab-menu id="sub-nav" class="flex justify-center md:mx-2 text-sm pb-2 md:pb-5">
    <ly-tab-menu-link
      aria-controls="profile-settings-content"
      :to="{ name: 'ProfileMembershipSettings' }"
      label="profiles.settings.membership.label" />
    <ly-tab-menu-link
      aria-controls="profile-settings-content"
      :to="{ name: 'GeneralProfileSettings' }"
      label="profiles.settings.general.label" />
  </ly-tab-menu>
</template>

<style lang="postcss"></style>
