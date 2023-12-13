<script lang="ts" setup>
import ProfilePermissionsSettingsEntry from '@/profiles/components/permissions/ProfilePermissionsSettingsEntry.vue';
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
      t(p.name).toLowerCase().includes(searchValue),
  );
});

const filterModuleId = (moduleId: string) => (search.value = moduleId);
</script>

<template>
  <ly-content-panel>
    <div class="relative inline-block my-1 w-full md:w-1/3">
      <input
        v-model="search"
        type="text"
        :placeholder="$t('tags.view.search')"
        class="search w-full pl-2 border-divide text-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-r-3xl p-1 bg-main" />
      <ly-icon
        :name="!search.length ? 'search' : 'close'"
        class="absolute right-2.5 top-2 text-dimmed cursor-pointer"
        @click="search = ''" />
    </div>
    <ly-responsive>
      <ly-table class="border-collapse">
        <template #body>
          <tr>
            <td colspan="2"></td>
            <td></td>
          </tr>
          <tr>
            <th class="pt-2 md:pt-4 px-1 md:px-5 text-secondary">
              {{ t('profiles.settings.permissions.header.permission') }}
            </th>
            <th class="pt-2 md:pt-4 px-1 md:px-5 hidden md:table-cell text-secondary">
              {{ t('profiles.settings.permissions.header.module') }}
            </th>
            <th class="pt-2 md:pt-4 px-1 md:px-5 text-secondary">
              {{ t('profiles.settings.permissions.header.level') }}
            </th>
          </tr>
          <profile-permissions-settings-entry
            v-for="permission in filteredPermissions"
            :key="permission.id"
            :permission="permission"
            @select-module-id="filterModuleId" />
        </template>
      </ly-table>
    </ly-responsive>
  </ly-content-panel>
</template>

<style scoped></style>
