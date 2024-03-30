<script lang="ts" setup>
import { useUserInfo } from '../../composables';

const userInfo = useUserInfo();
</script>

<template>
  <ly-avatar v-if="userInfo" class="w-8 h-8" :name="userInfo.displayName" :guid="userInfo.guid" />
</template>

<style scoped></style>
