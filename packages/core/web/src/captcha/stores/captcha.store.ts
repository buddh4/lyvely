import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useCaptchaService } from '@/captcha/services/captcha.service';
import { IsNotEmpty, Matches } from 'class-validator';
import {
  BaseModel,
  PropertyType,
  Headers,
  IFieldValidationResponse,
  IFieldValidationResult,
} from '@lyvely/common';
import { CaptchaChallenge } from '@lyvely/core-interface';
import { repository, isFieldValidationError, useStatus, loadingStatus } from '@/core';
import { I18nModelValidator, translate, translation } from '@/i18n';

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
  const captchaService = useCaptchaService();
  const status = useStatus();

  function reset() {
    captchaModel.value = new CaptchaModel();
    validator.value.setModel(captchaModel.value);
    challenge.value = undefined;
    imageUrl.value = undefined;
  }

  async function createChallenge() {
    reset();
    challenge.value = await loadingStatus(() => captchaService.challenge(), status);
    updateImageUrl();
  }

  async function refresh() {
    if (!challenge.value) {
      return createChallenge();
    }

    await captchaService.refresh(challenge.value.identity);
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

const authRepositoryPlugin = () => {
  repository.interceptors.request.use(function (config) {
    if (config.withCaptcha) {
      config.headers = config.headers || {};
      config.headers[Headers.X_CAPTCHA_TOKEN] = useCaptchaStore().getCaptchaValue();
      config.headers[Headers.X_CAPTCHA_ID] = useCaptchaStore().getCaptchaIdentity();
    }
    return config;
  });

  repository.interceptors.response.use(undefined, (error) => {
    if (!error.config.withCaptcha || !isFieldValidationError(error)) {
      return Promise.reject(error);
    }

    const validation = error.response.data as IFieldValidationResponse;

    const captchaError = validation.fields.find((field) => field.property === 'captcha');
    if (captchaError)
      useCaptchaStore().setCaptchaError({
        property: 'captcha',
        errors: [translate('captcha.errors.invalid')],
      });

    return Promise.reject(error);
  });
};

authRepositoryPlugin();
