import { defineStore } from "pinia";
import { ref } from "vue";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import {
  IFieldValidationResult,
  ModelValidator,
  VerifyEmailDto,
} from "@lyvely/common";
import { I18nModelValidator } from "@/modules/core/models/i18n-model.validator";
import { AccountService } from "@/modules/account/services/account.service";
import { loadingStatus, useStatus } from "@/store";

export const useVerifyEmailStore = defineStore("verify-email", () => {
  const { user } = useAuthStore();
  const accountService = new AccountService();
  const status = useStatus();
  const model = ref(new VerifyEmailDto());
  const showModal = ref(false);

  const validator = ref(
    new I18nModelValidator(model.value, {
      translationKey: "account.my_account.info.errors",
      rules: {
        email: [
          (value: string, result: IFieldValidationResult) => {
            if (!user?.findEmail(value)) {
              result.errors!.push("not_exist");
            }
          },
        ],
      },
    })
  );

  function reset() {
    showModal.value = false;
    model.value = new VerifyEmailDto();
    status.resetStatus();
  }

  async function verifyEmail() {
    if (!(await validator.value.validate())) {
      return;
    }

    return loadingStatus(
      accountService.addEmail(model.value),
      status,
      validator.value as ModelValidator
    ).then(reset);
  }

  async function startVerificationOf(email: string) {
    model.value.email = email;
    model.value.otp = "";
    showModal.value = true;
  }

  return {
    status,
    model,
    validator,
    showModal,
    startVerificationOf,
    verifyEmail,
  };
});
