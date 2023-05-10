<script lang="ts" setup>
import ListPage from '@/modules/ui/components/layout/ListPage.vue';
import { useProfileStore } from '@/modules/profiles/stores/profile.store';
import { storeToRefs } from 'pinia';
import { useSendInviteUsersStore } from '@/modules/invitations/stores/send-invitations.store';
import ContentRoot from '@/modules/ui/components/layout/ContentRoot.vue';
import LyAvatar from '@/modules/ui/components/avatar/AvatarImage.vue';
import { useAuthStore } from '@/modules/auth/store/auth.store';
import { computed } from 'vue';
import { BaseMembershipRole } from '@lyvely/common';

const sendInviteStore = useSendInviteUsersStore();
const profileStore = useProfileStore();
const { profile } = storeToRefs(profileStore);
const { user } = storeToRefs(useAuthStore());

const order = [
  BaseMembershipRole.Owner,
  BaseMembershipRole.Admin,
  BaseMembershipRole.Moderator,
  BaseMembershipRole.Member,
  BaseMembershipRole.Guest,
];

const profileRelations = computed(() => {
  const profileRelations = profile.value.profileRelations;
  return [...profileRelations].sort((a: BaseMembershipRole, b: BaseMembershipRole) => {
    return order.indexOf(a) - order.indexOf(b);
  });
});

const openInviteModal = () => sendInviteStore.openModal(profileStore.profile!.id);
</script>

<template>
  <content-root>
    <list-page v-if="profile" title="profiles.users.title" icon="users">
      <template #header-right>
        <ly-button
          class="secondary outlined mr-0.5 inline-flex items-center text-xs py-0 px-1"
          @click="openInviteModal">
          <ly-icon name="invite" class="w-5" />
        </ly-button>
      </template>

      <div
        v-for="relation in profileRelations"
        :key="relation.uid"
        class="flex py-4 px-3 bg-main items-center border-divide">
        <ly-user-avatar v-if="relation.uid === user.id" />
        <ly-avatar v-else :name="relation.userInfo.displayName" :guid="relation.userInfo.guid" />
        <span class="ml-2">
          {{ relation.userInfo.displayName }}
          <small>({{ relation.role }})</small>
        </span>
      </div>
    </list-page>
  </content-root>
</template>

<style scoped></style>
