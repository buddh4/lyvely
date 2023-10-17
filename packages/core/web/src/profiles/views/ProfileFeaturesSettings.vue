<script lang="ts" setup>
import { getSettingFeaturesOfProfile } from '@/profiles/helpers';
import { t } from '@/i18n';
import { IFeature } from '@lyvely/core-interface';
import { cloneDeep } from 'lodash';
import { computed } from 'vue';

const installableFeatures = getSettingFeaturesOfProfile();
</script>

<template>
  <ly-content-panel>
    <div class="">
      <div class="p-5">
        <ly-dimmed size="xs">
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
            <tr
              v-for="feature in installableFeatures"
              :key="feature.id"
              class="border-b border-divide hover:bg-gray-50 dark:hover:bg-gray-600">
              <th scope="row" class="px-3 py-2 md:px-5 md:py-4 font-medium whitespace-nowrap">
                {{ t(feature.title) }}
                <ly-dimmed v-if="feature.description" :text="feature.description" />
              </th>
              <td class="flex items-center px-3 py-2 md:px-5 md:py-4 space-x-3">
                <ly-button class="primary text-xs" title="profiles.settings.features.configure">
                  <ly-icon name="settings" class="w-3.5" />
                </ly-button>
              </td>
              <td class="w-4 p-4">
                <div class="flex items-center">
                  <ly-checkbox />
                </div>
              </td>
            </tr>
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
