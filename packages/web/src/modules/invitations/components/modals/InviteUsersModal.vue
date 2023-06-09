<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { watch } from 'vue';
import { useSendInviteUsersStore } from '../../stores/send-invitations.store';

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
      <div class="flex flex-row items-center items-stretch mb-2">
        <ly-input-text
          v-model="emailInput"
          class="mb-0 grow"
          input-class="attachment-r"
          :autocomplete="true"
          :autofocus="true"
          label="profiles.invite.email-help" />
        <ly-button class="primary rounded-r w-12" @click="addEmails"> + </ly-button>
      </div>
      <ly-alert type="danger" :message="statusError" />
      <div v-for="email in emails" :key="email" class="flex mb-2">
        <div class="bg-highlight border border-divide p-2 rounded-l clearfix grow attachment-r">
          {{ email }}
        </div>
        <ly-button class="danger float-right attachment-l w-12" @click="removeEmail(email)">
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
      <ly-alert type="success" message="invitations.account.success" />
    </div>
  </ly-modal>
</template>

<style scoped></style>
