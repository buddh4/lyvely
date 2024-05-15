<script lang="ts" setup>
import { ContentModel } from '@lyvely/interface';
import { useRouter } from 'vue-router';
import { usePageStore } from '@/ui';
import { t } from '@/i18n';

interface IProps {
  content: ContentModel;
}

defineProps<IProps>();

const router = useRouter();

function historyBack() {
  if (hasHistory) router.go(-1);
  else router.push({ name: 'stream' });
}

const hasHistory = usePageStore().hasHistory;
</script>

<template>
  <div class="bg-main border-divide w-full rounded-t p-2.5 md:px-4">
    <div class="flex items-center">
      <a class="text-main cursor-pointer pl-0 text-sm" @click="historyBack">
        <ly-icon name="arrow-left" data-id="btn-back" class="mr-2 w-3" />
        <span>{{ t('common.back') }}</span>
      </a>
      <div class="ml-auto inline px-2 md:px-4">
        <ly-icon
          v-if="content.meta.archived"
          name="archive"
          :title="t('common.archived')"
          class="text-warning ml-auto w-4" />
      </div>
      <div v-if="!content.meta.archived" class="ml-auto">
        <!-- milestone-chooser :content="content" :editable="true" /-->
      </div>
    </div>
  </div>
</template>

<style scoped></style>
