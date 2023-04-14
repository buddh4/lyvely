import { defineStore } from 'pinia';
import { useStatus } from '@/store';
import { ref } from 'vue';
import { isValidEmail } from '@lyvely/common';

type InviteStages = 'users' | 'profile' | 'loading';

export const useInviteUsersStore = defineStore('invite-user', () => {
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

  function submit() {
    if (stage.value === 'users') {
      submitUserSelection();
    } else if (stage.value === 'profile') {
    }
  }

  function submitUserSelection() {
    if (validateUserSelection()) {
      reset();
    }
  }

  function submitProfileSelection() {}

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
