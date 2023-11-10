<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { UserInvitationInfo } from '@lyvely/core-interface';
import { EntityNotFoundException } from '@lyvely/common';
import { onMounted, ref } from 'vue';
import { useUserInvitationsService } from '../services';
import { profileIdRoute, profileRoute } from '@/profiles/routes/profile-route.helper';
import { LyCenteredPanel } from '@lyvely/ui';

const router = useRouter();

const token = router.currentRoute.value.query.pid as string;
const userInviteInfo = ref<UserInvitationInfo>();
const invitationsService = useUserInvitationsService();
const error = ref<string>();

async function accept() {
  if (!userInviteInfo.value) return;
  const pid = userInviteInfo.value!.pid;
  await invitationsService.accept(pid);
  await router.push(profileIdRoute(pid));
}

function decline() {
  if (!userInviteInfo.value) return;
  // TODO: as long as the notification is not invalidated we should not invalidate the invitation here
  //invitationsService.decline(userInviteInfo.value!.pid);
  if (window.history.length) {
    router.back();
  } else {
    toHome();
  }
}

function toHome() {
  router.push('/');
}

onMounted(async () => {
  useUserInvitationsService()
    .getUserInvitationInfo(token as string)
    .then((info) => {
      userInviteInfo.value = info;
    })
    .catch((err: unknown) => {
      if (err instanceof EntityNotFoundException) {
        error.value = 'invitations.errors.invalid';
      } else {
        error.value = 'error.unknown.message';
      }
    });
});
</script>

<template>
  <ly-centered-panel>
    <template #title>
      <ly-icon name="lyvely" class="fill-current text-lyvely mr-2 w-6" />
      <span v-if="error?.length" class="text-base font-bold">{{ $t('error.title') }}</span>
      <span v-else class="text-base font-bold">{{ $t('invitations.accept.headline') }}</span>
    </template>

    <template #body>
      <div v-if="userInviteInfo" class="flex flex-col">
        <div class="flex justify-center items-center gap-1">
          <ly-avatar :name="userInviteInfo.hostName" :guid="userInviteInfo.hostGuid" />
          <span class="text-sm font-bold">{{ userInviteInfo.hostName }}</span>
        </div>
        <div class="flex justify-center items-center m-2">
          <ly-icon name="envelope-open" class="w-12 text-secondary" />
        </div>

        <div class="flex justify-center items-center gap-1">
          <ly-avatar :name="userInviteInfo.profileName" :guid="userInviteInfo.profileGuid" />
          <span class="text-sm font-bold">{{ userInviteInfo.profileName }}</span>
        </div>
      </div>

      <div v-else-if="error?.length" class="flex flex-col justify-center">
        <ly-alert :message="error" type="danger" />
      </div>

      <div v-else>
        <ly-loader />
      </div>
    </template>

    <template #footer>
      <div v-if="error?.length" class="flex justify-center items-center gap-1">
        <ly-button class="primary" text="common.back_to_home" @click="toHome" />
      </div>
      <div v-else class="flex justify-center items-center gap-1">
        <ly-button class="secondary" text="common.decline" @click="decline" />
        <ly-button class="primary" text="common.accept" @click="accept" />
      </div>
    </template>
  </ly-centered-panel>
</template>
