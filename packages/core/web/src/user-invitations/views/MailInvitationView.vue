<script lang="ts" setup>
import { useRouter } from 'vue-router';
import {
  MailInvitationInfo,
  useUserInvitationsClient,
  DocumentNotFoundException,
} from '@lyvely/interface';
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/auth/store/auth.store';
import { storeToRefs } from 'pinia';
import { useAppConfigStore } from '@/app-config/app-config.store';
import { LyCenteredPanel } from '@lyvely/ui';

const router = useRouter();

const token = router.currentRoute.value.query.t as string;
const mailInviteInfo = ref<MailInvitationInfo>();
const appName = useAppConfigStore().get('appName');
const error = ref<string>();

const authStore = useAuthStore();
const { isAuthenticated, user } = storeToRefs(authStore);

function logoutAndRegister() {
  authStore.logout(false);
  setTimeout(register, 200);
}

function register() {
  document.location = `/register?invite=${encodeURIComponent(token)}&email=${encodeURIComponent(
    mailInviteInfo.value!.email,
  )}`;
}

onMounted(async () => {
  authStore.loadUser();
  useUserInvitationsClient()
    .getMailInvitationInfo(token as string)
    .then((info) => {
      mailInviteInfo.value = info;
    })
    .catch((err: unknown) => {
      if (err instanceof DocumentNotFoundException) {
        error.value = 'invitations.errors.invalid';
      } else {
        error.value = 'error.unknown';
      }
    });
});
</script>

<template>
  <ly-centered-panel title="invitations.headline">
    <template #body>
      <div v-if="mailInviteInfo">
        <div v-if="mailInviteInfo.pid && isAuthenticated">
          <i18n-t keypath="invitations.messages.profile_invite" tag="p" class="text-sm mb-3">
            <template #host>
              <b>{{ mailInviteInfo.hostName }}</b>
            </template>
            <template #profile>
              <b>{{ mailInviteInfo.profileName }}</b>
            </template>
          </i18n-t>

          <div class="flex flex-col space-y-1">
            <ly-button v-if="user?.id !== mailInviteInfo.hostId" class="primary">
              <i18n-t keypath="invitations.buttons.join_as_current">
                <template #username>
                  {{ user?.username }}
                </template>
              </i18n-t>
            </ly-button>
            <ly-button text="invitations.buttons.switch_account" class="primary" />
            <ly-button
              text="invitations.buttons.to_register"
              class="primary"
              @click="logoutAndRegister" />
            <ly-button text="invitations.buttons.ignore" class="primary" />
          </div>
        </div>

        <div v-else-if="mailInviteInfo.pid && !isAuthenticated">
          <i18n-t keypath="invitations.messages.profile_invite" tag="p" class="text-sm mb-3">
            <template #host>
              <b>{{ mailInviteInfo.hostName }}</b>
            </template>
            <template #profile>
              <b>{{ mailInviteInfo.profileName }}</b>
            </template>
          </i18n-t>
          <div class="flex flex-col space-y-1">
            <ly-button text="invitations.buttons.to_register" class="primary" />
            <ly-button text="invitations.buttons.login_and_join" class="primary" />
          </div>
        </div>

        <div v-else-if="!mailInviteInfo.pid && isAuthenticated">
          <i18n-t keypath="invitations.messages.invite_with_auth" tag="p" class="text-sm mb-3">
            <template #host>
              <b>{{ mailInviteInfo.hostName }}</b>
            </template>
            <template #appName>
              <b>{{ appName }}</b>
            </template>
            <template #username>
              <b>{{ user?.username }}</b>
            </template>
          </i18n-t>
          <div class="flex flex-col space-y-1">
            <ly-button
              text="invitations.buttons.to_register"
              class="primary"
              @click="logoutAndRegister" />
            <ly-button route="/" text="common.back_to_home" class="secondary" />
          </div>
        </div>

        <div v-else-if="!mailInviteInfo.pid && !isAuthenticated">
          <i18n-t keypath="invitations.messages.invite_no_auth" tag="p" class="text-sm mb-3">
            <template #host>
              <b>{{ mailInviteInfo.hostName }}</b>
            </template>
            <template #appName>
              <b>{{ appName }}</b>
            </template>
          </i18n-t>
          <div class="flex flex-col space-y-1">
            <ly-button text="invitations.buttons.to_register" class="primary" @click="register()" />
            <ly-button text="invitations.buttons.to_login" route="/login" class="secondary" />
          </div>
        </div>
      </div>

      <div v-else-if="error?.length" class="flex flex-col justify-center">
        <ly-alert type="danger" :text="error" />
        <ly-button v-if="isAuthenticated" route="/" text="common.back_to_home" class="primary" />
        <ly-button v-else route="/login" text="invitations.buttons.to_login" class="primary" />
      </div>

      <div v-else>
        <ly-loader />
      </div>
    </template>

    <template #footer> </template>
  </ly-centered-panel>
</template>
