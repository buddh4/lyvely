<script lang="ts" setup></script>

<template>
  <div id="sub-nav" class="flex justify-center md:mx-2 text-sm pb-2 md:pb-5">
    <div
      id="activity-navigation"
      class="button-group flex flex-inline btn-group max-w-md w-full"
      role="tablist"
      aria-label="Activity Navigation"
    >
      <ly-button
        :route="{ name: 'UserProfileSettings' }"
        role="tab"
        aria-controls="calendar-plan"
        class="secondary outlined grow px-1 py-1"
      >
        User
      </ly-button>
      <ly-button
        :route="{ name: 'GeneralProfileSettings' }"
        role="tab"
        aria-controls="calendar-plan"
        class="secondary outlined grow px-1 py-1"
      >
        Profile
      </ly-button>
    </div>
  </div>
</template>

<style lang="postcss"></style>
