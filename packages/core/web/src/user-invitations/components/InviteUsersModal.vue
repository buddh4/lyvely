<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { watch } from 'vue';
import { useSendInviteUsersStore } from '../stores';

const inviteUserStore = useSendInviteUsersStore();

const { emails, showModal, statusError, emailInput, stage } = storeToRefs(inviteUserStore);
const { submit, reset, addEmails, removeEmail } = inviteUserStore;

watch(emailInput, (value) => {
  if (value.slice(-1) === ',') addEmails();
});
</script>

<template>
  <ly-modal
    v-model="showModal"
    title="profiles.invite.title"
    :cancel-button-text="stage === 'success' ? 'common.close' : 'common.cancel'"
    :submit-button="stage !== 'success'"
    @cancel="reset"
    @submit="submit"
    @hide="reset">
    <div v-if="stage === 'users'">
      <div class="mb-2 flex flex-row items-center items-stretch">
        <ly-text-field
          v-model="emailInput"
          class="mb-0 grow"
          input-class="attachment-r"
          :autocomplete="true"
          :autofocus="true"
          label="profiles.invite.email-help" />
        <ly-button class="primary w-12 rounded-r" @click="addEmails"> + </ly-button>
      </div>
      <ly-alert type="danger" :text="statusError" />
      <div v-for="email in emails" :key="email" class="mb-2 flex">
        <div class="clearfix attachment-r grow rounded-l border border-divide bg-highlight p-2">
          {{ email }}
        </div>
        <ly-button class="danger attachment-l float-right w-12" @click="removeEmail(email)">
          <ly-icon name="delete" />
        </ly-button>
      </div>
    </div>
    <div v-else-if="stage === 'profile'"></div>
    <div v-else-if="stage === 'loading'">
      <div class="h-12">
        <ly-loader />
      </div>
    </div>
    <div v-if="stage === 'success'">
      <ly-alert type="success" text="invitations.account.success" />
    </div>
  </ly-modal>
</template>

<style scoped></style>
