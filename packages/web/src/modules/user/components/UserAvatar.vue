<script lang="ts" setup>
import { computed } from "vue";
import { createFileUrl } from "@/repository";
import randomColor from "randomcolor";
import { IUser } from "@lyvely/common";
import { useAuthStore } from "@/modules/user/store/auth.store";
import { getContrast } from "@/modules/ui/utils";

interface Props {
  modelValue?: IUser;
}

const props = defineProps<Props>();

const user = computed(() => props.modelValue || useAuthStore().user) ;
const url = computed(() => user.value?.imageHash ? createFileUrl(user.value.imageHash) : undefined);
const initials = computed(() => user.value?.username.substring(0,2));
const color = computed(() => randomColor({ seed: user.value?.username + '_user' || '' }));
const textClass = computed(() => {
  return getContrast(color.value) === 'black' ? 'text-slate-900' : 'text-slate-100';
})
</script>

<template>
  <img v-if="url" src="url">
  <div :class="['rounded-full uppercase text-xs p-1', textClass]" :style="{ 'background-color': color  }">{{ initials }}</div>
</template>

<style scoped>

</style>
