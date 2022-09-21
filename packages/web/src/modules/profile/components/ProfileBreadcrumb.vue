<script lang="ts" setup>
import { useProfileStore } from "@/modules/profile/stores/profile.store";
import { computed } from "vue";
import { useRouter } from "vue-router";

const profile = computed(() => useProfileStore().profile);
const profileName = computed(() => profile.value?.name);
const path = computed(() => {
  const path = useRouter().currentRoute.value.path.split('/').filter((p) => p?.length)
  const result: { path: string, name: string}[] = [];
  let curr = '';
  path.forEach((subPath, i) => {
    curr = curr + '/' + subPath;

    if(i > 1) { // We ignore /p/:pid
      result.push({ path: curr, name: subPath });
    }
  })
  return result;
})
</script>

<template>
  <router-link to="/"><span class="text-pop">@</span> {{ profileName }}</router-link>
  <template v-for="sub in path" :key="sub.path">
    <span class="mx-0.5">/</span>
    <router-link :to="sub.path">{{ sub.name }}</router-link>
  </template>
</template>

<style scoped>

</style>
