<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { getContrast } from '@/helpers';
import randomColor from 'randomcolor';
import { type IAvatar, type IAvatarData, type IFallbackAvatarData } from '@/interfaces';
import { createAvatarUrl } from '@/config';
import { useTwMerge } from '@/composables';

defineOptions({
  inheritAttrs: false,
});

export interface IProps {
  avatar?: IAvatar;
  name?: string;
  guid?: string;
  url?: string;
  border?: boolean;
  timestamp?: number;
}

const props = withDefaults(defineProps<IProps>(), {
  avatar: undefined,
  guid: undefined,
  name: undefined,
  url: undefined,
  border: false,
  timestamp: undefined,
});

const altName = computed(() => props.name || (props.avatar as IFallbackAvatarData)?.name);
const imgGuid = computed(() => (props.avatar as IAvatarData)?.guid || props.guid);
const imgTimestamp = computed(() => (props.avatar as IAvatarData)?.timestamp || props.timestamp);
const imgError = ref(false);

watch(
  () => props.avatar,
  () => {
    imgError.value = false;
  }
);

watch(
  () => props.guid,
  () => {
    imgError.value = false;
  }
);

const imgUrl = computed(() => {
  return imgError.value
    ? undefined
    : props.url
      ? props.url
      : imgGuid.value
        ? createAvatarUrl(imgGuid.value!, imgTimestamp.value)
        : undefined;
});

const initials = computed(() => (imgUrl.value ? undefined : altName.value?.substring(0, 2) || '?'));
const color = computed(() =>
  imgUrl.value ? undefined : randomColor({ seed: altName.value + '_user' + imgGuid.value || '' })
);

const attrs = computed(() => {
  const textClass =
    !imgUrl.value && color.value
      ? getContrast(color.value!) === 'dark'
        ? 'text-slate-900'
        : 'text-slate-100'
      : '';

  const defaults = {
    'rounded-full uppercase flex justify-center items-center select-none w-6 h-6 text-xxs': true,
    'border border-shadow dark:border-divide': props.border,
    [textClass]: true,
  };

  if (!imgUrl.value) {
    defaults['p-1'] = true;
  }

  const { attrs } = useTwMerge(defaults);
  return attrs.value;
});
</script>

<template>
  <img v-if="imgUrl" v-bind="attrs" :alt="altName" :src="imgUrl" @error="imgError = true" />
  <div v-else v-bind="attrs" :style="{ 'background-color': color }">
    {{ initials }}
  </div>
</template>

<style scoped></style>
