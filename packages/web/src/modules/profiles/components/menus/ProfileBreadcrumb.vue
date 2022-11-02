<script lang="ts" setup>
import { useProfileStore } from '@/modules/profiles/stores/profile.store';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from "@/modules/auth/store/auth.store";

const profile = computed(() => useProfileStore().profile);
const userName = computed(() => useAuthStore().user?.username);
const profileName = computed(() => profile.value?.name);
const isProfileRoute = computed(() => useRouter().currentRoute.value.path.startsWith('/p/'));
const path = computed(() => {
  const path = useRouter()
    .currentRoute.value.path.split('/')
    .filter((p) => p?.length);
  const result: { path: string; name: string }[] = [];
  let curr = '';

  path.forEach((subPath, i) => {
    curr = curr + '/' + subPath;

    if (!isProfileRoute.value || i > 1) {
      // We ignore /p/:pid
      result.push({ path: curr, name: subPath });
    }
  });
  return result;
});
</script>

<template>
  <div id="profile-breadcrumb" class="border border-divide px-3 p-2 rounded-2xl text-sm hidden sm:inline-block">
    <router-link v-if="isProfileRoute" to="/" class="text-main">
      <span class="text-pop">@</span>
      {{ profileName }}
    </router-link>
    <router-link v-else to="/account" class="text-main">
      <span class="text-pop">@</span>
      {{ userName }}
    </router-link>

    <template v-for="sub in path" :key="sub.path">
      <span class="mx-0.5">/</span>
      <router-link :to="sub.path" class="text-main">{{ sub.name }}</router-link>
    </template>
  </div>
</template>

<style scoped></style>
