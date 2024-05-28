<script lang="ts" setup>
import { useAuthStore } from '@/auth/stores/auth.store';
import { t } from '@/i18n';
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useAddEmailStore } from '@/user-account/stores/add-email.store';
import AddEmailModal from '@/user-account/components/modals/AddEmailModal.vue';
import VerifyEmailModal from '@/user-account/components/modals/VerifyEmailModal.vue';
import { useVerifyEmailStore } from '@/user-account/stores/verify-email.store';

const { user } = storeToRefs(useAuthStore());
const addEmailStore = useAddEmailStore();
const verifyEmailStore = useVerifyEmailStore();

const { showModal: showAddEmailModal } = storeToRefs(addEmailStore);

const userEmails = computed(() => {
  const authStore = useAuthStore();
  return authStore.user?.emails.sort((a, b) => {
    if (authStore.user?.email === a.email) return -1;
    if (authStore.user?.email === b.email) return 1;
    if (a.verified !== b.verified) return a.verified ? -1 : 1;
    return a.email < b.email ? -1 : 1;
  });
});

const verifyEmail = (email: string) => {
  verifyEmailStore.startVerificationOf(email);
};
</script>

<template>
  <ly-list-page v-if="user" title="user-account.my-account.info.label" class="mb-2" icon="info">
    <table class="w-full border-collapse rounded bg-main text-sm">
      <tr>
        <th class="border-b border-divide p-3 text-left">
          {{ t('user-account.my-account.info.username') }}
        </th>
        <td class="border-b border-divide p-3 text-left">
          {{ user.username }}
        </td>
      </tr>
      <tr>
        <th class="border-b border-divide p-3 text-left">
          {{ t('user-account.my-account.info.member-since') }}
        </th>
        <td class="border-b border-divide p-3 text-left">
          <ly-formatted-date :date="user.createdAt" />
        </td>
      </tr>
      <tr>
        <th class="p-3 text-left">
          {{ t('user-account.my-account.info.locale') }}
        </th>
        <td class="bg-main p-3 text-left">
          {{ user.locale }}
        </td>
      </tr>
    </table>
  </ly-list-page>

  <ly-list-page v-if="user" title="user-account.my-account.info.emails" icon="email">
    <template #header-right>
      <ly-add-button @click="showAddEmailModal = true" />
    </template>
    <div
      v-for="userEmail in userEmails"
      :key="userEmail.email"
      class="flex items-center border-divide bg-main px-3 py-4">
      <ly-icon
        v-if="userEmail.email === user.email"
        name="star"
        class="mr-1 text-pop"
        title="user-account.my-account.info.main_email"
        tabindex="0" />
      <ly-icon
        v-else-if="!userEmail.verified"
        name="warning"
        class="mr-1 text-warning"
        title="user-account.my-account.info.unverified_email"
        tabindex="0" />
      <ly-icon
        v-else
        name="success"
        class="mr-1 text-success-light"
        title="user-account.my-account.info.verified_email"
        tabindex="0" />

      {{ userEmail.email }}

      <div class="ml-auto">
        <ly-button
          v-if="!userEmail.verified"
          class="secondary outlined mr-1"
          :title="t('common.resend')"
          @click="verifyEmail(userEmail.email)">
          <ly-icon name="send" />
        </ly-button>
      </div>
    </div>
  </ly-list-page>

  <add-email-modal />
  <verify-email-modal />
</template>

<style scoped></style>
