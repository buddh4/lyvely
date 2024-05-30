<script lang="ts" setup>
import { useProfileStore } from '@/profiles/stores/profile.store';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/auth/stores/auth.store';
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
    data-id="profile-breadcrumb"
    class="hidden rounded-2xl border border-divide p-2 px-3 text-xs sm:inline-flex sm:flex-nowrap">
    <router-link v-if="isProfileRoute" to="/" class="flex flex-nowrap gap-1 text-main">
      <span class="text-pop">@</span>
      <ly-truncate :text="profileName" max="10" class="whitespace-nowrap" />
    </router-link>
    <router-link v-else to="/account" class="text-main">
      <span class="text-pop">@</span>
      {{ userName }}
    </router-link>

    <template v-for="sub in path" :key="sub.path">
      <span class="mx-0.5">/</span>
      <router-link :to="sub.path" class="whitespace-nowrap text-main">
        <ly-truncate :text="sub.name" max="10" class="whitespace-nowrap" />
      </router-link>
    </template>
  </div>
</template>

<style scoped></style>
