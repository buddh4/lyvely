import { defineStore } from 'pinia';
import { useStatus } from '@/store';
import { ref } from 'vue';
import { isValidEmail } from '@lyvely/common';

export const useInviteUsersStore = defineStore('invite-user', () => {
  const status = useStatus();
  const showModal = ref(false);
  const emails = ref<string[]>([]);
  const emailInput = ref('');

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
    if (validate()) {
      reset();
    }
  }

  function validate() {
    if (!emails.value.length) {
      status.setError('profile.invite.email-empty');
      return false;
    }
    return true;
  }

  function reset() {
    emails.value = [];
    showModal.value = false;
    status.resetStatus();
  }

  return {
    ...status,
    emails,
    addEmails,
    removeEmail,
    emailInput,
    showModal,
    submit,
    reset,
  };
});
