<script lang="ts" setup>
import ListPage from '@/modules/ui/components/layout/ListPage.vue';
import { useProfileStore } from '@/modules/profiles/stores/profile.store';
import { storeToRefs } from 'pinia';
import { useInviteUsersStore } from '@/modules/profiles/stores/invite-users.store';

const profileStore = useProfileStore();
const { showModal: showInviteModal } = storeToRefs(useInviteUsersStore());
const { profile } = storeToRefs(profileStore);
</script>

<template>
  <list-page v-if="profile" title="profile.users.title" icon="users">
    <template #header-right>
      <ly-button
        class="secondary outlined mr-0.5 inline-flex items-center text-xs py-0 px-1"
        @click="showInviteModal = true"
      >
        <ly-icon name="invite" class="w-5" />
      </ly-button>
    </template>

    <div
      v-for="relation in profile.relations"
      :key="relation.uid"
      class="flex py-4 px-3 bg-main items-center border-divide"
    >
      <ly-user-avatar :user="{ id: relation.uid, username: relation.userInfo.displayName }" />
      <span class="ml-2">
        {{ relation.userInfo.displayName }}
      </span>
    </div>
  </list-page>
</template>

<style scoped></style>
