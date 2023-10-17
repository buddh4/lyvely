<script lang="ts" setup>
import imgUrl from '@/assets/404.png';
</script>

<template>
  <div class="card error-page">
    <img alt="Page Not Found" :src="imgUrl" />
    <router-link to="/" class="btn btn-primary">{{ $t('common.back_to_home') }}</router-link>
  </div>
</template>

<style lang="scss" scoped>
.error-page {
  border-radius: 10px;
  overflow: hidden;

  a {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
}
</style>
