<script lang="ts" setup>
import CaptchaCode from "@/modules/captcha/components/CaptchaCode.vue";
import { computed, ref } from "vue";
import { uniqueId } from "lodash";

export interface IProps {
  modelValue: string;
}

const props = defineProps<IProps>();
const emit = defineEmits(["update:modelValue"]);
const version = ref(Date.now());

const inputValue = computed({
  get: () => props.modelValue,
  set: (val: string) => emit("update:modelValue"),
});

const inputId = uniqueId("captcha");
const captcha = ref<{refresh: () => void}>();

function refresh() {
  captcha.value?.refresh();
}
</script>

<template>
  <div class="rounded">
    <div class="flex border border-divide border-b-0 rounded-t">
      <label :for="inputId" class="text-sm opacity-70 px-3 py-2">
        {{ $t("captcha.label") }}
      </label>

      <ly-icon
        name="refresh"
        class="ml-auto mx-3 opacity-70 cursor-pointer"
        @click="refresh"
      ></ly-icon>
    </div>
    <div class="border border-divide border-b-0">
      <suspense>
        <captcha-code ref="captcha" class="border-x border-divide"></captcha-code>
      </suspense>
    </div>
    <ly-input-text
      :id="inputId"
      v-model="inputValue"
      input-class="rounded-t-none"
    />
  </div>
</template>

<style scoped></style>
