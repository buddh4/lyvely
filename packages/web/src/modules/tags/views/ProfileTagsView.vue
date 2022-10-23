<script lang="ts" setup>
import { useProfileStore } from '@/modules/profiles/stores/profile.store';
import { computed, ref, onMounted } from 'vue';
import EditTagModal from '@/modules/tags/components/EditTagModal.vue';
import { useEditTagStore } from '@/modules/tags/stores/editTagStore';
import { TagModel, UpdateTagDto, CreateTagDto, TagFilter } from '@lyvely/common';
import ListPage from '@/modules/ui/components/layout/ListPage.vue';
import FloatingAddButton from '@/modules/ui/components/button/FloatingAddButton.vue';
import { usePageStore } from '@/modules/core/store/page.store';
import AddButton from '@/modules/ui/components/button/AddButton.vue';

const filter = ref(new TagFilter({ archived: false }));

const profileStore = useProfileStore();
const editTagStore = useEditTagStore();
const { setEditModel, setCreateModel } = editTagStore;
const tags = computed(() => filter.value.apply(profileStore.profile?.tags));

const setEditTag = (tag: TagModel) => {
  setEditModel(tag.id, new UpdateTagDto(tag));
};

const setCreateTag = () => {
  setCreateModel(new CreateTagDto());
};

function archive(tag: TagModel) {
  editTagStore.archiveModel(tag.id, tag);
}

function unArchive(tag: TagModel) {
  editTagStore.unArchiveModel(tag.id, tag);
}

function confirmArchive(tag: TagModel) {
  return tag.archived ? { text: 'tags.unarchive.confirm.text' } : { text: 'tags.archive.confirm.text' };
}

onMounted(() => usePageStore().accessibilityFocus('.list-page-headline'));
</script>

<template>
  <list-page title="tags.view.title" aria-label="tags.view.aria.title" icon="tags">
    <template #header-right>
      <add-button @click="setCreateTag" />
    </template>
    <div class="py-3 pr-3 border-divide bg-highlight dark:bg-main">
      <div class="relative inline-block">
        <input
          ref="search"
          v-model="filter.query"
          type="text"
          :placeholder="$t('tags.view.search')"
          class="search pl-2 ml-2 border-divide text-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-r-3xl p-1 bg-main dark:bg-highlight"
        />
        <ly-icon name="search" class="absolute right-2.5 top-2 text-dimmed pointer-events-none" />
      </div>
      <div class="float-right">
        <ly-button
          :active="filter.archived"
          class="secondary outlined text-xs px-0.5 py-0.5"
          :title="$t('filter.archive')"
          @click="filter.archived = !filter.archived"
        >
          <ly-icon name="archive" class="p-0.5"></ly-icon>
        </ly-button>
      </div>
    </div>
    <div v-for="tag in tags" :key="tag.id" class="flex py-4 px-3 bg-main items-center border-divide">
      <div class="align-middle">
        <ly-tag :tag="tag" class="px-3 py-2 text-sm" @click="setEditTag(tag)" />
        <ly-badge v-if="tag.archived" class="bg-danger ml-2">
          {{ $t('common.archived') }}
        </ly-badge>
      </div>
      <div class="mr-auto"></div>
      <div class="align-middle">
        <ly-button class="secondary outlined mr-1" :title="$t('common.edit')" @click="setEditTag(tag)">
          <ly-icon name="edit" />
        </ly-button>
        <ly-button
          v-if="tag.archived"
          class="secondary outlined"
          :confirm="confirmArchive(tag)"
          :title="$t('common.unarchive')"
          @click="unArchive(tag)"
        >
          <ly-icon name="unarchive" />
        </ly-button>
        <ly-button
          v-else
          class="secondary outlined"
          :confirm="confirmArchive(tag)"
          :title="$t('common.archive')"
          @click="archive(tag)"
        >
          <ly-icon name="archive" />
        </ly-button>
      </div>
    </div>
    <div v-if="!tags.length" class="p-5 border-divide">
      <span v-if="filter.isActive()">{{ $t('filter.empty') }}</span>
      <span v-else>{{ $t('list.empty') }}</span>
    </div>
  </list-page>
  <edit-tag-modal />
  <floating-add-button @click="setCreateTag" />
</template>

<style scoped></style>
