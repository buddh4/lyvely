<script lang="ts" setup>
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { useProfileRelationInfosStore } from "@/modules/profiles/stores/profile-relation-infos.store";
import { storeToRefs } from "pinia";
import { ProfileType } from "@lyvely/common";

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const profileRelationInfosStore = useProfileRelationInfosStore();
const profileRelations = await profileRelationInfosStore.getRelations();
const orgCount = profileRelations.profiles.filter(
  (p) => p.type === ProfileType.Organization
).length;
const groupCount = profileRelations.profiles.filter(
  (p) => p.type === ProfileType.Group
).length;
const userProfileCount = profileRelations.profiles.filter(
  (p) => p.type === ProfileType.User
).length;
</script>

<template>
  <div class="flex items-center justify-center">
    <div class="m-5">
      <ly-user-avatar class="w-16 h-16 text-xl" />
    </div>
    <div class="py-5 px-2 flex flex-col">
      <h2 class="font-bold text-xl">{{ user.username }}</h2>
      <div class="flex">
        <div class="flex items-center mr-2">
          <span class="mr-1 font-bold">{{ userProfileCount }}</span>
          <span class="text-sm">Profiles</span>
        </div>
        <div class="flex items-center mr-2">
          <span class="mr-1 font-bold">{{ groupCount }}</span>
          <span class="text-sm">Groups</span>
        </div>
        <div class="flex items-center">
          <span class="mr-1 font-bold">{{ orgCount }}</span>
          <span class="text-sm">Organizations</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
