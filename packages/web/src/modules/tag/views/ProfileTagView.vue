<script lang="ts" setup>
import MainContainer from '@/modules/ui/components/layout/MainContainer.vue';
import Tag from '@/modules/tag/components/Tag.vue';
import { useProfileStore } from "@/modules/user/store/profile.store";
import { computed, ref, Ref } from 'vue';
import Button from "@/modules/ui/components/button/Button.vue";
import Icon from "@/modules/ui/components/icon/Icon.vue";
import EditTagModal from "@/modules/tag/components/EditTagModal.vue";
import { useEditTagStore } from "@/modules/tag/stores/editTagStore";
import { ITag, EditTagDto } from "@lyvely/common";
import ListPage from "@/modules/ui/components/layout/ListPage.vue";
import { Size } from '@/modules/ui/types';

class TagFilter {
  query: string;
  archived: boolean;

  check(tag: ITag): boolean {
    if(this.query?.length && !tag.name.match(new RegExp(this.query, 'i'))) {
      return false;
    }

    return true;
  }

  isActive() {
    if(this.query.length) {
      return true;
    }

    return false;
  }
}

const filter = ref(new TagFilter());

const profileStore = useProfileStore();
const { setEditModel } = useEditTagStore();
const tags = computed(() => profileStore.profile?.tags.filter(tag => filter.value.check(tag)) || []);
const model = computed(() => useEditTagStore().model);

const setEditTag = (tag: ITag) => {
  setEditModel(tag.id, new EditTagDto(tag))
}

const search = ref(null) as Ref<HTMLElement|null>;

function focusSearch() {
  search.value?.focus();
}

</script>

<template>
  <MainContainer id="activity-overview" :width="Size.LG">
    <ListPage title="tags.view.title" icon="tags">
      <div class="py-1">
        <div class="relative inline-block">
          <input
ref="search" v-model="filter.query" type="text" :placeholder="$t('tags.view.search')"
            class="border-l-0 pl-2 border-slate-300 text-sm focus:border-blue-300 focus:ring placeholder:text-slate-300 focus:ring-blue-200 focus:ring-opacity-50 rounded-r-3xl p-1" />
          <Icon name="search" class="absolute right-2.5 top-2 text-slate-300 cursor-pointer" @click="focusSearch" />
        </div>
      </div>
      <div v-for="tag in tags" :key="tag.id" class="flex py-4 px-3 bg-content items-center hover:bg-slate-100">
        <div class="align-middle">
          <Tag :tag="tag" class="px-3 py-2 text-sm" @click="setEditTag(tag)" />
        </div>
        <div class="mr-auto"></div>
        <div class="align-middle">
          <Button @click="setEditTag(tag)"><Icon name="edit" /></Button>
          <Button><Icon name="archive" /></Button>
        </div>
      </div>
      <div v-if="!tags.length" class="p-5">
        <span v-if="filter.isActive">{{ $t('filter.empty') }}</span>
        <span v-else>{{ $t('list.empty') }}</span>
      </div>
    </ListPage>
    <EditTagModal />
  </MainContainer>
</template>

<style scoped></style>
