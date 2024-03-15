<script lang="ts" setup>
import { ContentModel } from '@lyvely/interface';
import { useRouter } from 'vue-router';
import { usePageStore } from '@/ui';
import { t } from '@/i18n';
//import MilestoneChooser from '@/milestones/components/menus/MilestoneDropdown.vue';

interface IProps {
  content: ContentModel;
}

const props = defineProps<IProps>();

const router = useRouter();

function historyBack() {
  if (!hasHistory) return;
  router.go(-1);
}

const hasHistory = usePageStore().hasHistory;
</script>

<template>
  <div class="p-2.5 md:px-4 bg-main border-divide rounded-t w-full">
    <div class="flex items-center">
      <ly-button v-if="hasHistory" class="text-sm pl-0" @click="historyBack">
        <ly-icon name="arrow-left" data-id="btn-back" class="w-3 mr-2" /><span>{{
          t('common.back')
        }}</span>
      </ly-button>
      <div class="px-2 md:px-4 ml-auto inline">
        <ly-icon
          v-if="content.meta.archived"
          name="archive"
          :title="t('common.archived')"
          class="w-4 text-warning ml-auto" />
      </div>
      <div v-if="!content.meta.archived" class="ml-auto">
        <!--milestone-chooser :content="content" :editable="true" / -->
      </div>
    </div>
  </div>
</template>

<style scoped></style>
