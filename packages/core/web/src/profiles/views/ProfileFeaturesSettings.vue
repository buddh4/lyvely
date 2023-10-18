<script lang="ts" setup>
import { t } from '@/i18n';
import { useProfileFeatureStore } from '@/profiles/stores/profile-feature.store';
import ProfileFeatureSettingsEntry from '@/profiles/components/features/ProfileFeatureSettingsEntry.vue';
import { storeToRefs } from 'pinia';
import { useProfileStore } from '@/profiles';

const { profile } = storeToRefs(useProfileStore());
const installableFeatures = useProfileFeatureStore().getSettingFeaturesOfProfile();
</script>

<template>
  <ly-content-panel>
    <div class="">
      <div class="p-5">
        <ly-dimmed class="text-xs">
          Here you can enable or disable certain profile features. Note that in most cases disabling
          a feature will not remove any of the data related with a feature but rather hide features
          in menus and and other parts of the application. If disabling or enabling a certain
          feature has any side effects, you will be asked for confirmation.
        </ly-dimmed>
      </div>

      <ly-responsive>
        <ly-table>
          <template #head>
            <tr>
              <th scope="col" class="px-3 py-2 md:px-5 md:py-3">
                {{ t('profiles.settings.features.name') }}
              </th>
              <th scope="col" class="px-3 py-2 md:px-5 md:py-3">
                {{ t('profiles.settings.features.actions') }}
              </th>
              <th scope="col" class="px-3 py-2 md:p-4"></th>
            </tr>
          </template>
          <template #body>
            <profile-feature-settings-entry
              v-for="feature in installableFeatures"
              :key="feature.id"
              :feature="feature" />
          </template>
        </ly-table>
      </ly-responsive>
    </div>

    <!-- div class="m-2 divide-y">
          <div class="flex justify-between hover:bg-slate-50">
            <label for="f1" class="p-2 text-sm">Stream</label>
            <div class="p-2 ml-auto">
              <input name="f1" class="p-2" type="checkbox" />
            </div>
          </div>
          <div class="flex justify-between hover:bg-slate-50">
            <label for="f1" class="p-2">Activities</label>
            <div class="p-2 ml-auto">
              <input name="f1" class="p-2" type="checkbox" />
            </div>
          </div>
          <div class="flex gap-1 hover:bg-slate-50">
            <div class="w-2 bg-slate-200"></div>
            <label for="f1" class="p-2">Activities</label>
            <div class="p-2 ml-auto">
              <input name="f1" class="p-2" type="checkbox" />
            </div>
          </div>
          <div class="flex gap-1 hover:bg-slate-50">
            <div class="w-2 bg-slate-200"></div>
            <label for="f1" class="p-2">Tasks</label>
            <div class="p-2 ml-auto">
              <input name="f1" class="p-2" type="checkbox" />
            </div>
          </div>
          <div class="flex gap-1 hover:bg-slate-50">
            <div class="w-2 bg-slate-200"></div>
            <label for="f1" class="p-2">Milestones</label>
            <div class="p-2 ml-auto">
              <input name="f1" class="p-2" type="checkbox" />
            </div>
          </div>
          <div class="flex justify-between hover:bg-slate-50">
            <label for="f1" class="p-2">Journals</label>
            <div class="p-2 ml-auto">
              <input name="f1" class="p-2" type="checkbox" />
            </div>
          </div>
          <div class="flex justify-between hover:bg-slate-50">
            <label for="f1" class="p-2">Statistics</label>
            <div class="p-2 ml-auto">
              <input name="f1" class="p-2" type="checkbox" />
            </div>
          </div>
        </div>
      </div -->
  </ly-content-panel>
</template>

<style scoped></style>
