<script lang="ts" setup>
import ProfilePermissionsSettingsEntry from '@/profiles/components/permissions/ProfilePermissionsSettingsEntry.vue';
import { LyListPage, LyListPageSection } from '@lyvely/ui';
import { useProfilePermissionsStore } from '@/profiles/stores';
import { computed, ref } from 'vue';
import { t } from '@/i18n';

const permissions = useProfilePermissionsStore().getPermissions();

const search = ref('');
const filteredPermissions = computed(() => {
  const searchValue = search.value.toLowerCase();
  if (!searchValue.length) return permissions;
  return permissions.filter(
    (p) =>
      p.moduleId.includes(searchValue) ||
      t(p.description).toLowerCase().includes(searchValue) ||
      t(p.name).toLowerCase().includes(searchValue)
  );
});

const filterModuleId = (moduleId: string) => (search.value = moduleId);
</script>

<template>
  <ly-list-page title="profiles.settings.permissions.headline" aria-label="tags.view.aria.title">
    <ly-list-page-section>
      <div class="flex items-center">
        <div class="relative my-1 inline-block w-full md:w-1/3">
          <input
            v-model="search"
            type="text"
            :placeholder="t('profiles.settings.permissions.search')"
            class="search w-full rounded-r-3xl border-divide bg-main p-1 pl-2 text-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
          <ly-icon
            :name="!search.length ? 'search' : 'close'"
            class="absolute right-2.5 top-2 cursor-pointer text-dimmed"
            @click="search = ''" />
        </div>
      </div>
    </ly-list-page-section>
    <ly-list-page-section>
      <ly-responsive>
        <ly-table class="border-collapse">
          <template #body>
            <profile-permissions-settings-entry
              v-for="permission in filteredPermissions"
              :key="permission.id"
              :permission="permission"
              @select-module-id="filterModuleId" />
          </template>
        </ly-table>
      </ly-responsive>
    </ly-list-page-section>
  </ly-list-page>
</template>

<style scoped></style>
