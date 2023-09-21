<script lang="ts" setup>
import { computed } from 'vue';
import { useAuthStore } from '@/modules/auth/store/auth.store';

const user = computed(() => useAuthStore().user);
</script>

<template>
  <ly-avatar v-if="user" :avatar="user.avatar" :name="user.username" :guid="user.guid" />
</template>

<style scoped></style>
