<script lang="ts" setup>
import { useProfileStore } from '@/profiles/stores/profile.store';
import { storeToRefs } from 'pinia';
import { useSendInviteUsersStore } from '@/user-invitations/stores/send-invitations.store';
import { useAuthStore } from '@/auth/store/auth.store';
import { computed } from 'vue';
import { BaseMembershipRole, ProfileRelationModel } from '@lyvely/core-interface';

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
  const profileRelations = profile.value?.profileRelations || [];
  return [...profileRelations].sort((a: ProfileRelationModel, b: ProfileRelationModel) => {
    return (
      order.indexOf((a.role as BaseMembershipRole) || BaseMembershipRole.Guest) -
      order.indexOf((b.role as BaseMembershipRole) || BaseMembershipRole.Guest)
    );
  });
});

const openInviteModal = () => sendInviteStore.openModal(profileStore.profile!.id);
</script>

<template>
  <ly-content-root>
    <ly-list-page v-if="profile" title="profiles.users.title" icon="users">
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
        <ly-user-avatar v-if="relation.uid === user?.id" />
        <ly-avatar v-else :name="relation.userInfo.displayName" :guid="relation.userInfo.guid" />
        <span class="ml-2">
          {{ relation.userInfo.displayName }}
          <small>({{ relation.role }})</small>
        </span>
      </div>
    </ly-list-page>
  </ly-content-root>
</template>

<style scoped></style>
