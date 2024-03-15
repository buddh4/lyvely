<script lang="ts" setup>
import { useAuthStore } from '@/auth/store/auth.store';
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
    <table class="border-collapse text-sm w-full bg-main rounded">
      <tr>
        <th class="p-3 text-left border-b border-divide">
          {{ t('user-account.my-account.info.username') }}
        </th>
        <td class="p-3 text-left border-b border-divide">
          {{ user.username }}
        </td>
      </tr>
      <tr>
        <th class="p-3 text-left border-b border-divide">
          {{ t('user-account.my-account.info.member-since') }}
        </th>
        <td class="p-3 text-left border-b border-divide">
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
      class="flex py-4 px-3 bg-main items-center border-divide">
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
