import { ContentModel } from '@lyvely/interface';
import { getContentTypeIcon, getContentTypeOptions } from '../registries';
import { IDefaultStreamEntryOptions, StreamEntryLayout } from '../interfaces';
import { computed } from 'vue';
import { useUserInfo } from '@/profiles';
import { translate } from '@/i18n';

interface UseStreamEntryInfoOptions {
  model: ContentModel;
  layout?: StreamEntryLayout;
  icon?: string;
  iconClass?: string;
  merge?: boolean;
  omitTags?: boolean;
}

export const useContentStreamEntryInfo = (options: UseStreamEntryInfoOptions) => {
  const { model } = options;
  const contentTypeOptions = getContentTypeOptions(model);
  const streamEntryOptions = (<IDefaultStreamEntryOptions>contentTypeOptions?.interfaces?.stream)
    ?.entryOptions;
  const layout = computed(
    () => options.layout ?? (streamEntryOptions?.layout || StreamEntryLayout.Block)
  );
  const icon = computed(() => options.icon ?? getContentTypeIcon(model));
  const iconClass = computed(
    () => options.iconClass ?? (streamEntryOptions?.iconClass || 'text-main')
  );
  const omitTags = computed(() => options.omitTags ?? streamEntryOptions?.omitTags ?? false);
  const contentRoute = contentTypeOptions?.route;

  const userInfo = useUserInfo(model.meta.createdBy);

  const isMessageLayout = layout.value === StreamEntryLayout.Message;

  const contentTypeName = computed(() => translate(getContentTypeOptions(model.type)?.name || ''));

  const showUserAvatar = computed(
    () => !options.icon && userInfo.value && (isMessageLayout || !icon.value)
  );

  const merge = computed(() => options.merge ?? streamEntryOptions?.merge ?? true);

  return {
    icon,
    iconClass,
    contentRoute,
    layout,
    omitTags,
    contentTypeOptions,
    streamEntryOptions,
    userInfo,
    isMessageLayout,
    contentTypeName,
    showUserAvatar,
    merge,
  };
};
