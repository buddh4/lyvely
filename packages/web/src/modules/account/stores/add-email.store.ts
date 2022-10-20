import { defineStore, storeToRefs } from "pinia";
import { ref } from "vue";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import {
  AddEmailDto,
  IFieldValidationResult,
  ModelValidator,
  UserEmailModel,
} from "@lyvely/common";
import { I18nModelValidator } from "@/modules/core/models/i18n-model.validator";
import { AccountService } from "@/modules/account/services/account.service";
import { loadingStatus, useStatus } from "@/store";
import { useVerifyEmailStore } from "@/modules/account/stores/verify-email.store";

export const useAddEmailStore = defineStore("add-email", () => {
  const { user } = storeToRefs(useAuthStore());
  const verifyEmailStroe = useVerifyEmailStore();
  const accountService = new AccountService();
  const status = useStatus();
  const model = ref(new AddEmailDto());
  const showModal = ref(false);

  const validator = ref(
    new I18nModelValidator(model.value, {
      translationKey: "account.my_account.add_email.errors",
      rules: {
        email: [
          (value: string, result: IFieldValidationResult) => {
            if (user.value?.findEmail(value)) {
              result.errors!.push("email_exists");
            }
          },
        ],
      },
    })
  );

  async function addEmail() {
    if (!(await validator.value.validate())) {
      return;
    }

    return loadingStatus(
      accountService.addEmail(model.value),
      status,
      validator.value as ModelValidator
    ).then(handleAddEmailSuccess);
  }

  function handleAddEmailSuccess() {
    const userEmail = new UserEmailModel({
      email: model.value.email,
      verified: false,
    });
    user.value?.emails.push(userEmail);
    reset();
    verifyEmailStroe.startVerificationOf(userEmail.email);
  }

  function reset() {
    showModal.value = false;
    model.value = new AddEmailDto();
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
