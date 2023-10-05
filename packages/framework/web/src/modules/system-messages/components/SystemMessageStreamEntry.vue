<script lang="ts" setup>
import { SystemMessageModel } from '@lyvely/system-messages-interface';
import { ContentModel } from '@lyvely/content-interface';
import ContentStreamEntry from '@/modules/content-stream/components/ContentStreamEntry.vue';
import { IStream } from '@/modules/stream/composables/stream.composable';
import { useAppConfigStore } from '@/modules/app-config/store/app-config.store';

export interface IProps {
  model: SystemMessageModel;
  stream: IStream<ContentModel>;
  index: number;
}

const props = defineProps<IProps>();

const appName = useAppConfigStore().config?.appName;
</script>

<template>
  <content-stream-entry
    v-bind="props"
    body-style="message"
    :merge="true"
    :message-width="true"
    :show-type="false">
    <template #image>
      <div class="flex justify-center rounded-full border border-divide w-8 h-8 bg-main">
        <ly-icon name="lyvely" class="text-pop" />
      </div>
    </template>

    <template #authorName>
      {{ appName }}
    </template>

    <template #default>
      <h1 v-if="model.content.title">{{ $t(model.content.title, model.content.params || {}) }}</h1>
      <span v-if="model.content.text">
        {{ $t(model.content.text, model.content.params || {}) }}
      </span>
    </template>
  </content-stream-entry>
</template>
