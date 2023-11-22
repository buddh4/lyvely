<script lang="ts" setup>
import CaptchaCode from '@/captcha/components/CaptchaCode.vue';
import { storeToRefs } from 'pinia';
import { uniqueId } from 'lodash';
import { computed } from 'vue';
import { useCaptchaStore } from '@/captcha/captcha.store';

interface IProps {
  id?: string;
}

const props = withDefaults(defineProps<IProps>(), {
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
    <div :class="['flex border border-b-0 rounded-t', borderColorClass]">
      <label :for="id" class="text-sm opacity-70 px-3 py-2">
        {{ $t('captcha.label') }}
      </label>

      <ly-icon
        name="refresh"
        class="ml-auto mx-3 opacity-70 cursor-pointer"
        @click="refresh"></ly-icon>
    </div>
    <div :class="['border border-b-0', borderColorClass]">
      <captcha-code></captcha-code>
    </div>
    <ly-text-field
      :id="id"
      v-model="captchaModel.captcha"
      :error="validator.getError('captcha')"
      input-style="border-top-left-radius: 0;border-top-right-radius: 0"
      @focusout="validate" />
  </div>
</template>

<style scoped></style>
