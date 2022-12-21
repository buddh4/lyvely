<script lang="ts" setup>
import { computed } from 'vue';
import { useAuthStore } from '@/modules/auth/store/auth.store';

const user = computed(() => useAuthStore().user);
</script>

<template>
  <ly-avatar :avatar="user.avatar" :name="user.username" />
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
