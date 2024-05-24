<script lang="ts" setup>
import { useUserInfo } from '../../composables';

const userInfo = useUserInfo();
</script>

<template>
  <ly-avatar v-if="userInfo" class="h-8 w-8" :name="userInfo.displayName" :guid="userInfo.guid" />
</template>

<style scoped></style>
