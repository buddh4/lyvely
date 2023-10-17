<script lang="ts" setup>
import { contentRoute } from '../routes/content-route.helper';
import { ContentModel } from '@lyvely/core-interface';
import { useRouter } from 'vue-router';
//import MilestoneChooser from '@/milestones/components/menus/MilestoneDropdown.vue';

interface IProps {
  content: ContentModel;
}

const props = defineProps<IProps>();

const router = useRouter();

function back() {
  if (props.content.meta.parentId) {
    router.push(contentRoute(props.content.pid, props.content.meta.parentId));
  } else {
    router.push({ name: 'stream' });
  }
}
</script>

<template>
  <div class="p-2.5 md:px-4 bg-main border-divide rounded-t w-full">
    <div class="flex items-center">
      <ly-button class="text-sm pl-0" @click="back">
        <ly-icon name="arrow-left" class="w-3 mr-2" /><span>{{ $t('common.back') }}</span>
      </ly-button>
      <div class="px-2 md:px-4 ml-auto inline">
        <ly-icon
          v-if="content.meta.archived"
          name="archive"
          :title="$t('common.archived')"
          class="w-4 text-warning ml-auto" />
      </div>
      <div v-if="!content.meta.archived" class="ml-auto">
        <!--milestone-chooser :content="content" :editable="true" / -->
      </div>
    </div>
  </div>
</template>

<style scoped></style>
