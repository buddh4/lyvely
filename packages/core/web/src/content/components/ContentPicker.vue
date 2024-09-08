<script setup lang="ts">
import { computed } from 'vue';
import { type IAvatar, IPickerOption, type Translatable } from '@lyvely/ui';
import { uniqueId } from '@lyvely/common';
import { translation } from '@/i18n';
import type { IContentPickerProvider, IContentSearchQuery } from '@lyvely/interface';
import { ContentModel, useContentClient } from '@lyvely/interface';
import { getContentTypeIcon, getStreamEntryLayout } from '@/content/registries';
import { StreamEntryLayout } from '@/content/interfaces';
import { useUserInfo } from '@/profiles';

const props = withDefaults(
  defineProps<{
    modelValue: Array<string> | undefined;
    filter?: IContentSearchQuery;
    provider?: IContentPickerProvider;
    label?: Translatable;
    title?: Translatable;
    max?: number;
    id?: string;
  }>(),
  {
    id: uniqueId('tag-picker'),
    label: translation('common.content'),
    title: translation('content.picker.title'),
    provider: undefined,
  }
);

const emit = defineEmits(['update:modelValue']);

const defaultProvider = async (query: string) => {
  const { infos } = await useContentClient().getInfos({ ...props.filter, query });
  return infos;
};

const contentProvider = async (search?: string) => {
  if (!search?.length) {
    return props.modelValue?.length ? useContentClient().getInfos({ cids: props.modelValue }) : [];
  }

  const provider = props.provider || defaultProvider;

  const result = await provider(search);
  return result.map((contentInfo) => {
    const layout = getStreamEntryLayout(contentInfo.type);
    const userInfo = useUserInfo(contentInfo.createdBy).value;
    const showAvatar = userInfo && layout === StreamEntryLayout.Message;
    const icon = getContentTypeIcon(contentInfo.type);
    const avatar: IAvatar | undefined = showAvatar
      ? {
          guid: userInfo.guid!,
          name: userInfo.displayName,
        }
      : undefined;

    return {
      key: contentInfo.id,
      label: contentInfo.title,
      description: contentInfo.text,
      icon,
      avatar,
    } satisfies IPickerOption;
  });
};

const model = computed({
  get: () => props.modelValue || [],
  set: (value: Array<string>) => emit('update:modelValue', value),
});
</script>

<template>
  <ly-picker v-model="model" :max="max" :label="label" :provider="contentProvider" />
</template>

<style scoped></style>
