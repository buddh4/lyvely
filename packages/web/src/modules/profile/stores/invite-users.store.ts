import { defineStore } from 'pinia';
import { useStatus } from "@/store/status";
import { ref } from "vue";
import { validateEmail } from "@lyvely/common";

export const useInviteUsersStore = defineStore('invite-user', () => {
  const status = useStatus();
  const showModal = ref(false);
  const emails = ref<string[]>([]);
  const emailInput = ref('');

  function addEmails() {
    const emailsArr = emailInput.value.split(',').map(email => email.trim()).filter(email => email?.length && !emails.value.includes(email));
    const invalidEmailsArr = emailsArr.filter(email => !validateEmail(email));
    const validEmailsArr = emailsArr.filter(validateEmail);

    if(validEmailsArr.length) {
      emails.value.push(...validEmailsArr);
    }

    emailInput.value = invalidEmailsArr.length ? invalidEmailsArr.join(', ') : '';

    if(invalidEmailsArr.length) {
      status.setError('profile.invite.email-invalid');
    } else {
      status.reset();
    }
  }

  function removeEmail(emailToDelete: string) {
    emails.value = emails.value.filter(email => email !== emailToDelete);
  }

  function submit() {
    if(validate()) {

      reset();
    }
  }

  function validate() {
    if(!emails.value.length) {
      status.setError('profile.invite.email-empty');
      return false;
    }
    return true;
  }

  function reset() {
    emails.value = [];
    showModal.value = false;
    status.reset();
  }

  return {
    ...status,
    emails,
    addEmails,
    removeEmail,
    emailInput,
    showModal,
    submit,
    reset
  }
})
