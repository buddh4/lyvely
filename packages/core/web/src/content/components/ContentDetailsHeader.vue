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
  <div class="w-full rounded-t border-divide bg-main p-2.5 md:px-4">
    <div class="flex items-center">
      <a class="cursor-pointer pl-0 text-sm text-main" @click="historyBack">
        <ly-icon name="arrow-left" data-id="btn-back" class="mr-2 w-3" />
        <span>{{ t('common.back') }}</span>
      </a>
      <div class="ml-auto inline px-2 md:px-4">
        <ly-icon
          v-if="content.meta.archived"
          name="archive"
          :title="t('common.archived')"
          class="ml-auto w-4 text-warning" />
      </div>
      <div v-if="!content.meta.archived" class="ml-auto">
        <!-- milestone-chooser :content="content" :editable="true" /-->
      </div>
    </div>
  </div>
</template>

<style scoped></style>
