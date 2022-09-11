<script lang="ts" setup>
import ListPage from "@/modules/ui/components/layout/ListPage.vue";
import { useProfileStore } from "@/modules/profile/stores/profile.store";
import { storeToRefs } from "pinia";
import UserAvatar from "@/modules/user/components/UserAvatar.vue";

const profileStore = useProfileStore();

const { profile } = storeToRefs(profileStore);
</script>

<template>
  <ListPage title="profile.users.title" icon="users">
    <div v-for="relation in profile.relations" :key="relation.uid" class="flex py-4 px-3 bg-main items-center border-divide">
      <UserAvatar :user="{ id: relation.uid, username: relation.userInfo.displayName }" />
      <span class="ml-2">
        {{ relation.userInfo.displayName }}
      </span>
    </div>
  </ListPage>
</template>

<style scoped></style>
