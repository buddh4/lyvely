<script lang="ts" setup>
import { computed } from 'vue';
import { useAuthStore } from '@/auth/store/auth.store';

withDefaults(
  defineProps<{
    border?: boolean;
  }>(),
  {
    border: true,
  },
);

const user = computed(() => useAuthStore().user);
</script>

<template>
  <ly-avatar
    v-if="user"
    :avatar="user.avatar"
    :name="user.username"
    :guid="user.guid"
    :border="border" />
</template>

<style scoped></style>
