<script lang="ts" setup>
import { useProfileStore } from '../stores';
import { storeToRefs } from 'pinia';
import { useSendInviteUsersStore } from '@/user-invitations/stores/send-invitations.store';
import { useAuthStore } from '@/auth/stores/auth.store';
import { computed } from 'vue';
import { ProfileMembershipRole, ProfileRelationModel } from '@lyvely/interface';
import UserRelationAvatar from '../components/avatars/UserRelationAvatar.vue';

const sendInviteStore = useSendInviteUsersStore();
const profileStore = useProfileStore();
const { profile } = storeToRefs(profileStore);
const { user } = storeToRefs(useAuthStore());

const order = [
  ProfileMembershipRole.Owner,
  ProfileMembershipRole.Admin,
  ProfileMembershipRole.Moderator,
  ProfileMembershipRole.Member,
  ProfileMembershipRole.Guest,
];

const profileRelations = computed<ProfileRelationModel[]>(() => {
  const profileRelations = profile.value?.profileRelations || [];
  return [...profileRelations].sort((a: ProfileRelationModel, b: ProfileRelationModel) => {
    return (
      order.indexOf((a.role as ProfileMembershipRole) || ProfileMembershipRole.Guest) -
      order.indexOf((b.role as ProfileMembershipRole) || ProfileMembershipRole.Guest)
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
          class="secondary outlined mr-0.5 inline-flex items-center px-1 py-0 text-xs"
          @click="openInviteModal">
          <ly-icon name="invite" class="w-5" />
        </ly-button>
      </template>

      <div
        v-for="relation in profileRelations"
        :key="relation.uid"
        class="bg-main border-divide flex items-center gap-2 px-3 py-4">
        <user-relation-avatar v-if="relation.uid === user?.id" />
        <ly-avatar v-else :name="relation.userInfo.displayName" :guid="relation.userInfo.guid" />
        <span>{{ relation.userInfo.displayName }}</span>
        <ly-badge class="bg-secondary ml-auto">{{ relation.role }}</ly-badge>
      </div>
    </ly-list-page>
  </ly-content-root>
</template>

<style scoped></style>
