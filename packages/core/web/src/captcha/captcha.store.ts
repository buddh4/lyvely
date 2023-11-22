import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useCaptchaClient, CaptchaChallenge } from '@lyvely/interface';
import { IsNotEmpty, Matches } from 'class-validator';
import { BaseModel, PropertyType, IFieldValidationResult } from '@lyvely/common';
import { useStatus, loadingStatus } from '@/core';
import { I18nModelValidator, translation } from '@/i18n';

class CaptchaModel extends BaseModel<CaptchaModel> {
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9]{5}$/, { message: translation('validation.isCaptcha') })
  @PropertyType(String, { default: '' })
  captcha: string;
}

export const useCaptchaStore = defineStore('captcha', () => {
  const captchaModel = ref(new CaptchaModel());
  const validator = ref(new I18nModelValidator(captchaModel.value));
  const challenge = ref<CaptchaChallenge>();
  const imageUrl = ref();
  const captchaClient = useCaptchaClient();
  const status = useStatus();

  function reset() {
    captchaModel.value = new CaptchaModel();
    validator.value.setModel(captchaModel.value);
    challenge.value = undefined;
    imageUrl.value = undefined;
  }

  async function createChallenge() {
    reset();
    challenge.value = await loadingStatus(() => captchaClient.challenge(), status);
    updateImageUrl();
  }

  async function refresh() {
    if (!challenge.value) {
      return createChallenge();
    }

    await captchaClient.refresh(challenge.value.identity);
    updateImageUrl();
  }

  function setCaptchaError(errs: IFieldValidationResult) {
    validator.value.setErrors([errs]);
  }

  function getCaptchaValue() {
    return captchaModel.value.captcha;
  }

  function getCaptchaIdentity() {
    return challenge.value?.identity || '';
  }

  function updateImageUrl() {
    if (!challenge.value) {
      imageUrl.value = undefined;
      return;
    }

    imageUrl.value = `${challenge.value.imageUrl}&v=${Date.now()}`;
  }

  async function validate() {
    return validator.value.validate();
  }

  return {
    status,
    captchaModel,
    validator,
    getCaptchaValue,
    setCaptchaError,
    getCaptchaIdentity,
    validate,
    imageUrl,
    createChallenge,
    refresh,
    reset,
  };
});
