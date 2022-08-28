<script lang="ts" setup>
import { IProfile } from "@lyvely/common/src";
import { useProfileStore } from "@/modules/profile/stores/profile.store";
import { computed } from "vue";
import { createFileUrl } from "@/repository";
import randomColor from "randomcolor";
import { getContrast } from "@/modules/ui/utils";

interface Props {
  modelValue?: IProfile;
}

const props = defineProps<Props>();

const profile = computed(() => props.modelValue || useProfileStore().profile) ;
const url = computed(() => profile.value?.imageHash ? createFileUrl(profile.value.imageHash) : undefined);
const initials = computed(() => profile.value?.name.substring(0,2));
const color = computed(() => randomColor({ seed: profile.value?.name + '_profile' || '' }));
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
