<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { watch } from 'vue';
import { useInviteUsersStore } from '../../stores/send-invitations.store';
import LyLoader from '@/modules/ui/components/loader/LoaderBlock.vue';
import LyAlert from '@/modules/ui/components/alert/AlertBlock.vue';

const inviteUserStore = useInviteUsersStore();

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
    submit-button-text="common.next"
    @cancel="reset"
    @submit="submit">
    <div v-if="stage === 'users'">
      <div class="flex flex-row items-center items-stretch mb-2">
        <ly-input-text
          v-model="emailInput"
          class="mb-0 grow"
          input-class="attachment-r"
          label="profiles.invite.email-help" />
        <ly-button class="primary rounded-r w-12" @click="addEmails"> + </ly-button>
      </div>
      <ly-alert :message="statusError" />
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
      <ly-loader />
    </div>
    <div v-if="stage === 'success'">
      <ly-alert type="success" message="invitations.messages.success" />
    </div>
  </ly-modal>
</template>

<style scoped></style>
