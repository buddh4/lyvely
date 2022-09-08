<script lang="ts" setup>
import { useProfileStore } from "@/modules/profile/stores/profile.store";
import { computed } from "vue";
import { createFileUrl } from "@/repository";
import randomColor from "randomcolor";
import { getContrast } from "@/modules/ui/utils";
import { IProfile } from "@lyvely/common";

interface Props {
  profile?: Pick<IProfile, 'id'|'imageHash'|'name'>;
}

const props = defineProps<Props>();

const profile = computed(() => props.profile || useProfileStore().profile) ;
const url = computed(() => profile.value?.imageHash ? createFileUrl(profile.value.imageHash) : undefined);
const hasUrl = computed(() => url.value?.length);
const initials = computed(() => profile.value?.name.substring(0,2));
const color = computed(() => randomColor({ seed: profile.value?.id || '' }));
const textClass = computed(() => {
  return getContrast(color.value) === 'black' ? 'text-slate-900' : 'text-slate-100';
})
</script>

<template>
  <img v-if="hasUrl" :src="url" />
  <div v-if="!hasUrl" :class="['rounded-full uppercase text-xs p-1', textClass]" :style="{ 'background-color': color  }">{{ initials }}</div>
</template>

<style scoped>

</style>
