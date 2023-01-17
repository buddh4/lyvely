<script lang="ts" setup>
const cssClass =
  'btn-add fixed bottom-5 right-5 ' +
  'md:bottom-8 md:right-8 cursor-pointer primary ' +
  'border border-primary z-10 drop-shadow-md shadow-secondary ' +
  'rounded-full w-9 h-9 font-bold text-xl text-center leading-5 ';
</script>

<template>
  <ly-button :class="cssClass" :title="$t('common.create-new')" :rounded="false"> + </ly-button>
</template>
