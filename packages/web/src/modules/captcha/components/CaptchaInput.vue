<script lang="ts" setup>
import CaptchaCode from "@/modules/captcha/components/CaptchaCode.vue";
import { computed } from "vue";

interface IProps {
  modelValue: string;
  purpose: string;
}

const props = defineProps<IProps>();
const emit = defineEmits(['update:modelValue'])

const inputValue = computed({
  get: () => props.modelValue,
  set: (val: string) => emit('update:modelValue')
});

</script>

<template>
  <div class="rounded overflow-hidden">
    <div class="border border-divide border-b-0 rounded-t overflow-hidden">
    <suspense>
      <captcha-code></captcha-code>
    </suspense>
    </div>
    <ly-input-text v-model="inputValue" input-class="rounded-t-none"  />
  </div>
</template>

<style scoped>

</style>
