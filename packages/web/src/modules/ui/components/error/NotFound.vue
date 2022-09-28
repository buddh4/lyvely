<template>
  <div class="card error-page">
    <img alt="Page Not Found" src="/images/404.png" />
    <router-link to="/" class="btn btn-primary">Take me back home</router-link>
  </div>
</template>

<script lang="ts" setup></script>

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
