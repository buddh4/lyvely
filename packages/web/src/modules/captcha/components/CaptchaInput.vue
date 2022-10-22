<script lang="ts" setup>
import CaptchaCode from "@/modules/captcha/components/CaptchaCode.vue";
import { computed } from "vue";
import { uniqueId } from "lodash";

interface IProps {
  modelValue: string;
  purpose: string;
}

const props = defineProps<IProps>();
const emit = defineEmits(["update:modelValue"]);

const inputValue = computed({
  get: () => props.modelValue,
  set: (val: string) => emit("update:modelValue"),
});

const inputId = uniqueId('captcha');

function refresh() {
  location.reload();
}
</script>

<template>
  <div class="rounded">
    <div class="flex border border-divide border-b-0 rounded-t">
      <label :for="inputId" class="text-sm opacity-70 px-3 py-2">
        {{ $t('captcha.label') }}
      </label>

      <ly-icon name="refresh" class="ml-auto mx-3 opacity-70 cursor-pointer" @click="refresh"></ly-icon>

    </div>
    <div class="border border-divide border-b-0">
      <suspense>
        <captcha-code></captcha-code>
      </suspense>
    </div>
    <ly-input-text v-model="inputValue" :id="inputId" input-class="rounded-t-none" />
  </div>
</template>

<style scoped></style>
