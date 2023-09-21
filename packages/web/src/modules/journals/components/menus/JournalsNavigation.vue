<script lang="ts" setup></script>

<template>
  <ly-tab-menu>
    <ly-tab-menu-link aria-controls="calendar-plan" :to="{ name: 'Journals' }">
      <div class="flex items-center justify-center">
        {{ $t('journals.title') }}
      </div>
    </ly-tab-menu-link>
  </ly-tab-menu>
</template>

<style lang="postcss"></style>
