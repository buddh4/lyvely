<script lang="ts" setup>
import CaptchaCode from '@/captcha/components/CaptchaCode.vue';
import { t } from '@/i18n';
import { storeToRefs } from 'pinia';
import { uniqueId } from 'lodash';
import { computed } from 'vue';
import { useCaptchaStore } from '@/captcha/captcha.store';

interface IProps {
  id?: string;
}

withDefaults(defineProps<IProps>(), {
  id: uniqueId('captcha'),
});

const captchaStore = useCaptchaStore();
const { captchaModel, validator } = storeToRefs(captchaStore);

captchaStore.createChallenge();

function refresh() {
  captchaStore.refresh();
}

function validate() {
  return captchaStore.validate();
}

const borderColorClass = computed(() =>
  validator.value.getError('captcha') ? 'border-danger' : 'border-divide',
);

defineExpose({ validate });
</script>

<template>
  <div class="rounded">
    <div :class="['flex rounded-t border border-b-0', borderColorClass]">
      <label :for="id" class="px-3 py-2 text-sm opacity-70">
        {{ t('captcha.label') }}
      </label>

      <ly-icon
        name="refresh"
        class="mx-3 ml-auto cursor-pointer opacity-70"
        @click="refresh"></ly-icon>
    </div>
    <div :class="['border border-b-0', borderColorClass]">
      <captcha-code></captcha-code>
    </div>
    <ly-text-field
      :id="id"
      v-model="captchaModel.captcha"
      :auto-validation="false"
      :error="validator.getError('captcha')"
      input-style="border-top-left-radius: 0;border-top-right-radius: 0"
      @focusout="validate" />
  </div>
</template>

<style scoped></style>
