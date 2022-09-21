<script lang="ts" setup>
import ListPage from "@/modules/ui/components/layout/ListPage.vue";
import { useProfileStore } from "@/modules/profile/stores/profile.store";
import { storeToRefs } from "pinia";
import UserAvatar from "@/modules/user/components/UserAvatar.vue";
import Button from "@/modules/ui/components/button/Button.vue";
import Icon from "@/modules/ui/components/icon/Icon.vue";
import { useInviteUsersStore } from "@/modules/profile/stores/invite-users.store";

const profileStore = useProfileStore();
const { showModal: showInviteModal } = storeToRefs(useInviteUsersStore());
const { profile } = storeToRefs(profileStore);

</script>

<template>
  <ListPage title="profile.users.title" icon="users">
    <template #header-right>
      <Button @click="showInviteModal = true" class="secondary outlined mr-0.5 inline-flex items-center text-xs py-0 px-1">
        <Icon name="invite" class="w-5" />
      </Button>
    </template>

    <div v-for="relation in profile.relations" :key="relation.uid" class="flex py-4 px-3 bg-main items-center border-divide">
      <UserAvatar :user="{ id: relation.uid, username: relation.userInfo.displayName }" />
      <span class="ml-2">
        {{ relation.userInfo.displayName }}
      </span>
    </div>
  </ListPage>
</template>

<style scoped></style>
