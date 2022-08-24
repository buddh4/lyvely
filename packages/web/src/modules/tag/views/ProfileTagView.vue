<script lang="ts" setup>
import MainContainer from '@/modules/ui/components/layout/MainContainer.vue';
import Tag from '@/modules/tag/components/Tag.vue';
import { useProfileStore } from "@/modules/profile/stores/profile.store";
import { computed, ref, Ref, toRefs, onMounted } from 'vue';
import Button from "@/modules/ui/components/button/Button.vue";
import Icon from "@/modules/ui/components/icon/Icon.vue";
import EditTagModal from "@/modules/tag/components/EditTagModal.vue";
import { useEditTagStore } from "@/modules/tag/stores/editTagStore";
import { ITag, EditTagDto } from "@lyvely/common";
import ListPage from "@/modules/ui/components/layout/ListPage.vue";
import { Size } from '@/modules/ui/types';
import AddButton from "@/modules/ui/components/button/AddButton.vue";
import Badge from "@/modules/ui/components/badge/Badge.vue";
import { usePageStore } from "@/modules/core/store/page.store";

class TagFilter {
  query: string;
  archived: boolean;

  constructor(obj?: Partial<TagFilter>) {
    Object.assign(this, obj);
    this.archived = this.archived ?? false;
  }

  check(tag: ITag): boolean {
    if(this.query?.length && !tag.name.match(new RegExp(this.query, 'i'))) {
      return false;
    }

    if(this.archived !== !!tag.archived) {
      return false;
    }

    return true;
  }

  isActive() {
    if(this.query.length) {
      return true;
    }

    if(this.archived) {
      return true;
    }

    return false;
  }
}

const filter = ref(new TagFilter());

const profileStore = useProfileStore();
const editTagStore = useEditTagStore();
const { setEditModel, setCreateModel } = editTagStore;
const tags = computed(() => profileStore.profile?.tags.filter(tag => filter.value.check(tag)) || []);
const { model } = toRefs(editTagStore);

const setEditTag = (tag: ITag) => {
  setEditModel(tag.id, new EditTagDto(tag))
}

const setCreateTag = () => {
  setCreateModel(new EditTagDto())
}

const search = ref(null) as Ref<HTMLElement|null>;

function focusSearch() {
  search.value?.focus();
}

function archive(tag: ITag) {
  editTagStore.archiveModel(tag.id, tag);
}

function unArchive(tag: ITag) {
  editTagStore.unArchiveModel(tag.id, tag);
}

function confirmArchive(tag: ITag) {
  return tag.archived ? { 'text': 'tags.unarchive.confirm.text' } : {  'text': 'tags.archive.confirm.text' };

}

onMounted(() => usePageStore().accessibilityFocus('.list-page-headline'));
</script>

<template>
  <MainContainer id="activity-overview" :width="Size.LG">
    <ListPage title="tags.view.title" aria-label="tags.view.aria.title" icon="tags">
      <template #header-right>
        <AddButton @click="setCreateTag"/>
      </template>
      <div class="py-1 pr-3">
        <div class="relative inline-block">
          <input ref="search" v-model="filter.query" type="text" :placeholder="$t('tags.view.search')" class="border-l-0 pl-2 border-slate-300 text-sm focus:border-blue-300 focus:ring placeholder:text-slate-300 focus:ring-blue-200 focus:ring-opacity-50 rounded-r-3xl p-1" />
          <Icon name="search" class="absolute right-2.5 top-2 text-slate-300 cursor-pointer" @click="focusSearch" />
        </div>
        <div class="float-right">
          <Button :active="filter.archived" class="secondary outlined text-xs px-0.5 py-0.5" :title="$t('filter.archive')" @click="filter.archived = !filter.archived">
            <Icon name="archive" class="p-0.5"></Icon>
          </Button>

        </div>
      </div>
      <div v-for="tag in tags" :key="tag.id" class="flex py-4 px-3 bg-content items-center hover:bg-slate-100">
        <div class="align-middle">
          <Tag :tag="tag" class="px-3 py-2 text-sm" @click="setEditTag(tag)" />
          <Badge v-if="tag.archived" class="bg-danger ml-2">{{ $t('common.archived') }}</Badge>
        </div>
        <div class="mr-auto"></div>
        <div class="align-middle">
          <Button :title="$t('common.edit')" @click="setEditTag(tag)"><Icon name="edit" /></Button>
          <Button v-if="tag.archived" :confirm="confirmArchive(tag)" :title="$t('common.unarchive')" @click="unArchive(tag)">
            <Icon name="unarchive" />
          </Button>
          <Button v-else :confirm="confirmArchive(tag)" :title="$t('common.archive')" @click="archive(tag)">
            <Icon name="archive" />
          </Button>
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
