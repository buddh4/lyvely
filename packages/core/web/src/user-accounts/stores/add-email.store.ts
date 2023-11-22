import { defineStore, storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useAuthStore } from '@/auth/store/auth.store';
import { IFieldValidationResult, ModelValidator } from '@lyvely/common';
import { AddEmailDto, UserEmailModel, OtpInfo } from '@lyvely/interface';
import { I18nModelValidator } from '@/i18n';
import { loadingStatus, useStatus } from '@/core';
import { useAccountService } from '@/user-accounts/services/account.service';
import { useVerifyEmailStore } from '@/user-accounts/stores/verify-email.store';

export const useAddEmailStore = defineStore('add-email', () => {
  const { user } = storeToRefs(useAuthStore());
  const verifyEmailStore = useVerifyEmailStore();
  const accountService = useAccountService();
  const status = useStatus();
  const model = ref(new AddEmailDto());
  const showModal = ref(false);

  const validator = ref(
    new I18nModelValidator<AddEmailDto>(model.value, {
      labelKey: 'user-accounts.my-account.add_email.errors',
      rules: {
        email: [
          (value: string, result: IFieldValidationResult) => {
            if (user.value?.findEmail(value)) {
              result.errors!.push('email_exists');
            }
          },
        ],
      },
    }),
  );

  async function addEmail() {
    toVerifyEmail(
      await loadingStatus(
        () => accountService.addEmail(model.value),
        status,
        validator.value as I18nModelValidator<AddEmailDto>,
      ),
    );
  }

  function toVerifyEmail(otpInfo: OtpInfo) {
    const userEmail = new UserEmailModel({
      email: model.value.email,
      verified: false,
    });
    user.value?.emails.push(userEmail);
    reset();
    verifyEmailStore.startVerificationOf(userEmail.email, otpInfo);
  }

  function reset() {
    showModal.value = false;
    model.value = new AddEmailDto();
    validator.value.setModel(model.value);
    status.resetStatus();
  }

  return {
    status,
    model,
    validator,
    addEmail,
    showModal,
  };
});
