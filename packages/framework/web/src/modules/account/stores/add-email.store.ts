import { defineStore, storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useAuthStore } from '@/modules/auth/store/auth.store';
import { IFieldValidationResult, ModelValidator } from '@lyvely/common';
import { AddEmailDto } from '@lyvely/user-accounts-interface';
import { UserEmailModel } from '@lyvely/users-interface';
import { OtpInfo } from '@lyvely/otp-interface';
import { I18nModelValidator } from '@/modules/core/models/i18n-model.validator';
import { useAccountService } from '@/modules/account/services/account.service';
import { loadingStatus, useStatus } from '@/store';
import { useVerifyEmailStore } from '@/modules/account/stores/verify-email.store';

export const useAddEmailStore = defineStore('add-email', () => {
  const { user } = storeToRefs(useAuthStore());
  const verifyEmailStore = useVerifyEmailStore();
  const accountService = useAccountService();
  const status = useStatus();
  const model = ref(new AddEmailDto());
  const showModal = ref(false);

  const validator = ref(
    new I18nModelValidator(model.value, {
      translationKey: 'account.my_account.add_email.errors',
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
        validator.value as ModelValidator,
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
