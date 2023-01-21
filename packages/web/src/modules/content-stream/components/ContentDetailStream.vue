<script lang="ts" setup>
import ContentStreamFooter from '@/modules/content-stream/components/ContentStreamFooter.vue';
import ContentStream from '@/modules/content-stream/components/ContentStream.vue';
import { ContentModel, ContentStreamFilter } from '@lyvely/common';
import { ref } from 'vue';
import LyLoader from '@/modules/ui/components/loader/LoaderBlock.vue';
import { getContentDetailsComponent } from '@/modules/content-stream/components/content-stream-entry.registry';

export interface IProps {
  content: ContentModel;
}

const props = defineProps<IProps>();
const emit = defineEmits(['back']);

const filter = ref(new ContentStreamFilter({ parent: props.content.id }));
const streamComponent = ref<ContentStream>();
</script>

<template>
  <content-stream ref="streamComponent" :filter="filter" :scroll-to-start="false" :batch-size="100">
    <template #before>
      <div
        v-if="content"
        class="flex flex-col mx-0 mt-0 md:mx-2 mb-4 border border-divide md:rounded divide-y">
        <div class="px-1 md:p-2 bg-main border-divide rounded-t w-full">
          <div class="flex items-center">
            <ly-button class="text-sm" @click="$emit('back')">
              <ly-icon name="arrow-left" class="w-3 mr-2" /><span>{{ $t('common.back') }}</span>
            </ly-button>
            <div class="px-1.5 ml-auto inline">
              <ly-icon
                v-if="content.meta.isArchived"
                name="archive"
                :title="$t('common.archived')"
                class="w-4 text-warning ml-auto" />
            </div>
          </div>
        </div>
        <div class="border-divide">
          <component :is="getContentDetailsComponent(content)" :model="content" />
        </div>
      </div>
      <div v-else class="p-2 md:p-4 m-4 border border-divide bg-main rounded">
        <ly-loader />
      </div>
    </template>
  </content-stream>
  <content-stream-footer :filter="filter" />
</template>

<style scoped></style>
