import { defineStore } from 'pinia';
import { loadingStatus, useStatus } from '@/store';
import { ref } from 'vue';
import { InvitationRequest, isValidEmail, MailInvite } from '@lyvely/common';
import { useInvitationsService } from '@/modules/invitations/services/invitations.service';

type InviteStages = 'users' | 'profile' | 'loading' | 'success';

export const useSendInviteUsersStore = defineStore('send-invitations', () => {
  const status = useStatus();
  const showModal = ref(false);
  const emails = ref<string[]>([]);
  const emailInput = ref('');
  const stage = ref<InviteStages>('users');
  const profileId = ref<string | null>(null);

  function addEmails() {
    const emailsArr = emailInput.value
      .split(',')
      .map((email) => email.trim())
      .filter((email) => email?.length && !emails.value.includes(email));
    const invalidEmailsArr = emailsArr.filter((email) => !isValidEmail(email));
    const validEmailsArr = emailsArr.filter(isValidEmail);

    if (validEmailsArr.length) {
      emails.value.push(...validEmailsArr);
    }

    emailInput.value = invalidEmailsArr.length ? invalidEmailsArr.join(', ') : '';

    if (invalidEmailsArr.length) {
      status.setError('profile.invite.email-invalid');
    } else {
      status.resetStatus();
    }
  }

  function removeEmail(emailToDelete: string) {
    emails.value = emails.value.filter((email) => email !== emailToDelete);
  }

  async function submit() {
    if (stage.value === 'users') {
      return submitUserSelection();
    } else if (stage.value === 'profile') {
    }
  }

  function submitUserSelection() {
    if (validateUserSelection()) {
      stage.value = 'loading';
      return loadingStatus(
        useInvitationsService().sendInvitations(
          new InvitationRequest({
            invites: emails.value.map((email) => new MailInvite({ email })),
          }),
        ),
        status,
      ).then(() => stage.value === 'success');
    }
  }

  function validateUserSelection() {
    if (!emails.value.length) {
      status.setError('profile.invite.email-empty');
      return false;
    }
    return true;
  }

  function reset() {
    emails.value = [];
    stage.value = 'users';
    showModal.value = false;
    status.resetStatus();
    profileId.value = null;
  }

  return {
    ...status,
    emails,
    stage,
    addEmails,
    removeEmail,
    emailInput,
    showModal,
    submit,
    reset,
  };
});
