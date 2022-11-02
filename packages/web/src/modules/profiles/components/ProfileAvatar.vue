<script lang="ts" setup>
import { useProfileStore } from '@/modules/profiles/stores/profile.store';
import { computed } from 'vue';
import { createFileUrl } from '@/repository';
import randomColor from 'randomcolor';
import { getContrast } from '@/modules/ui/utils';
import { ProfileModel } from '@lyvely/common';

export interface IProps {
  profile?: Pick<ProfileModel, 'id' | 'guid' | 'name'>;
}

const props = defineProps<IProps>();

const profile = computed(() => props.profile || useProfileStore().profile);
const url = computed(() => (profile.value?.guid ? createFileUrl(profile.value.guid) : undefined));
const hasUrl = computed(() => url.value?.length);
const initials = computed(() => profile.value?.name.substring(0, 2));
const color = computed(() => randomColor({ seed: profile.value?.id || '' }));
const textClass = computed(() => {
  return getContrast(color.value) === 'black' ? 'text-slate-900' : 'text-slate-100';
});
</script>

<template>
  <img v-if="hasUrl" :src="url" />
  <div
    v-if="!hasUrl"
    :class="['rounded-full w-6 h-6 uppercase flex justify-center items-center text-xs p-1 select-none', textClass]"
    :style="{ 'background-color': color }"
  >
    {{ initials }}
  </div>
</template>

<style scoped></style>
