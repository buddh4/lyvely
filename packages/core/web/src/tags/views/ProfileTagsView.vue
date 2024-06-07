<script lang="ts" setup>
import { useProfileStore } from '@/profiles/stores/profile.store';
import { computed, ref, onMounted } from 'vue';
import EditTagModal from '@/tags/components/EditTagModal.vue';
import { useEditTagStore } from '@/tags/stores/edit-tag.store';
import {
  TagModel,
  UpdateTagModel,
  CreateTagModel,
  TagFilter,
  useTagPermissions,
} from '@lyvely/interface';
import { accessibilityFocus } from '@/accessibility';
import TagBadge from '../components/TagBadge.vue';
import { t } from '@/i18n';
import { useProfilePermissions } from '@/profiles';

const filter = ref(new TagFilter({ archived: false }));

const profileStore = useProfileStore();
const editTagStore = useEditTagStore();
const { setUpdateModel, setCreateModel } = editTagStore;
const tags = computed(() => filter.value.apply(profileStore.profile?.tags));

const setEditTag = (tag: TagModel) => {
  setUpdateModel(tag.id, new UpdateTagModel(tag));
};

const setCreateTag = () => {
  setCreateModel(new CreateTagModel());
};

function archive(tag: TagModel) {
  editTagStore.archiveModel(tag.id, tag);
}

function restore(tag: TagModel) {
  editTagStore.restoreModel(tag.id, tag);
}

function confirmArchive(tag: TagModel) {
  return tag.archived
    ? { text: 'tags.restore.confirm.text' }
    : { text: 'tags.archive.confirm.text' };
}

const { isAllowed: canManageTags } = useProfilePermissions(useTagPermissions().Manage);

onMounted(() => accessibilityFocus('.list-page-headline'));
</script>

<template>
  <ly-content-root>
    <ly-list-page title="tags.view.title" aria-label="tags.view.aria.title" icon="tags">
      <ly-list-page-section>
        <div class="flex gap-1">
          <div class="relative inline-block w-full md:w-1/3">
            <input
              ref="search"
              v-model="filter.query"
              type="text"
              :placeholder="t('tags.view.search')"
              class="search w-full rounded-r-3xl border-divide bg-main p-1 pl-2 text-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
            <ly-icon
              name="search"
              class="pointer-events-none absolute right-2.5 top-2 text-dimmed" />
          </div>
          <ly-button
            data-id="btn-toggle-archived"
            :active="filter.archived"
            class="secondary outlined ml-auto px-1.5 py-1 text-xs"
            :title="t('filter.archive')"
            @click="filter.archived = !filter.archived">
            <ly-icon name="archive" class="p-0.5"></ly-icon>
          </ly-button>
        </div>
      </ly-list-page-section>

      <ly-list-page-section>
        <div
          v-for="tag in tags"
          :key="tag.id"
          class="flex items-center border-divide bg-main px-3 py-4">
          <div class="align-middle">
            <tag-badge :tag="tag" class="px-3 py-2 text-base" @click="setEditTag(tag)" />
            <ly-badge v-if="tag.archived" class="ml-2 bg-danger">
              {{ t('common.archived') }}
            </ly-badge>
          </div>
          <div class="mr-auto"></div>
          <div v-if="canManageTags" class="flex gap-2 align-middle">
            <ly-confirm-button
              v-if="tag.archived"
              :data-id="`btn-restore-${tag.id}`"
              class="secondary outlined"
              :confirm="confirmArchive(tag)"
              :title="t('common.restore')"
              @click="restore(tag)">
              <ly-icon name="restore" />
            </ly-confirm-button>
            <ly-confirm-button
              v-else
              :data-id="`btn-archive-${tag.id}`"
              class="secondary outlined"
              :options="confirmArchive(tag)"
              :title="t('common.archive')"
              @click="archive(tag)">
              <ly-icon name="archive" />
            </ly-confirm-button>
            <ly-button
              class="secondary outlined mr-1"
              :data-id="`btn-edit-${tag.id}`"
              :title="t('common.edit')"
              @click="setEditTag(tag)">
              <ly-icon name="edit" />
            </ly-button>
          </div>
        </div>
        <div v-if="!tags.length" class="border-divide bg-main p-5 text-xs">
          <span v-if="filter.isActive()">{{ t('filter.empty') }}</span>
          <span v-else>{{ t('list.empty') }}</span>
        </div>
      </ly-list-page-section>
    </ly-list-page>
    <edit-tag-modal />
    <ly-floating-add-button v-if="canManageTags" data-id="btn-floating-add" @click="setCreateTag" />
  </ly-content-root>
</template>

<style scoped></style>
