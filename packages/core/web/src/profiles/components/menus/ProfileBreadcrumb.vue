<script lang="ts" setup>
import { useProfileStore } from '@/profiles/stores/profile.store';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/auth/store/auth.store';
import { ITranslation } from '@/i18n';

const router = useRouter();
const profile = computed(() => useProfileStore().profile);
const userName = computed(() => useAuthStore().user?.username);
const profileName = computed(() => profile.value?.name);
const isProfileRoute = computed(() => router.currentRoute.value.path.startsWith('/p/'));

const path = computed(() => {
  const currentRoute = router.currentRoute.value;
  const translations = (currentRoute.meta?.breadcrumb || []) as ITranslation[];
  const path = currentRoute.path.split('/').filter((p) => p?.length);
  const result: { path: string; name: string }[] = [];
  let curr = '';

  path.forEach((subPath, i) => {
    curr = curr + '/' + subPath;
    let subPathName = subPath;
    const inverseIndex = path.length - i;
    if (translations.length >= inverseIndex) {
      subPathName = translations.at(-inverseIndex)?.() || subPath;
    }

    if (!isProfileRoute.value || i > 1) {
      // We ignore /p/:handle
      result.push({ path: curr, name: subPathName });
    }
  });
  return result;
});
</script>

<template>
  <div
    id="profile-breadcrumb"
    class="border border-divide px-3 p-2 rounded-2xl hidden sm:inline-flex sm:flex-nowrap text-xs">
    <router-link v-if="isProfileRoute" to="/" class="text-main flex flex-nowrap gap-1">
      <span class="text-pop">@</span>
      <ly-trim :text="profileName" max="10" class="whitespace-nowrap" />
    </router-link>
    <router-link v-else to="/account" class="text-main">
      <span class="text-pop">@</span>
      {{ userName }}
    </router-link>

    <template v-for="sub in path" :key="sub.path">
      <span class="mx-0.5">/</span>
      <router-link :to="sub.path" class="text-main whitespace-nowrap">
        <ly-trim :text="sub.name" max="10" class="whitespace-nowrap" />
      </router-link>
    </template>
  </div>
</template>

<style scoped></style>
