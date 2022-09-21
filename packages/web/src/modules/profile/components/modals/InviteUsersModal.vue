<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import Modal from "@/modules/ui/components/modal/Modal.vue";
import Icon from "@/modules/ui/components/icon/Icon.vue";
import { useInviteUsersStore } from "@/modules/profile/stores/invite-users.store";
import TextInput from "@/modules/ui/components/form/TextInput.vue";
import Button from "@/modules/ui/components/button/Button.vue";
import Alert from "@/modules/ui/components/alert/Alert.vue";

const inviteUserStore = useInviteUsersStore();

const { emails, showModal, statusError, emailInput } = storeToRefs(inviteUserStore);
const { submit, reset, addEmails, removeEmail } = inviteUserStore;

watch(emailInput, value => {
  if(value.slice(-1) === ',') addEmails();
})

</script>

<template>
  <Modal v-model="showModal" title="profile.invite.title" @cancel="reset" @submit="submit">
    <div class="flex flex-row items-center items-stretch mb-2">
      <TextInput v-model="emailInput" class="mb-0 grow" css-class="attachment-r" label="profile.invite.email-help" />
      <Button class="primary attachment-l w-12" @click="addEmails">+</Button>
    </div>
    <Alert :message="statusError" />
    <div v-for="email in emails" :key="email" class="flex mb-2">
      <div class="bg-highlight border border-divide p-2 rounded-l clearfix grow attachment-r">
        {{ email }}
      </div>
      <Button class="danger float-right attachment-l w-12" @click="removeEmail(email)"><Icon name="delete" /></Button>
    </div>
  </Modal>
</template>

<style scoped>

</style>
