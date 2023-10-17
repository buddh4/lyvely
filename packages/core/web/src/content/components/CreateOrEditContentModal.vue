<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useContentCreateStore } from '@/content/stores/content-create.store';
import { useContentEditStore } from '@/content/stores/content-edit.store';
import { getCreateContentTypes } from '../services';
import { translate } from '@/i18n';

const contentCreateStore = useContentCreateStore();
const {
  showCreateModal,
  showContentTypeMenu,
  contentType,
  initOptions: createInitOptions,
  createModalComponent,
} = storeToRefs(contentCreateStore);

const { onCreated, onCanceled: onCreateCanceled } = contentCreateStore;

const contentEditStore = useContentEditStore();
const {
  showEditModal,
  editModel,
  initOptions: editInitOptions,
  editModalComponent,
} = storeToRefs(useContentEditStore());

const { onUpdated, onCanceled: onUpdateCanceled } = contentEditStore;

function switchCreateContentType(type: string) {
  useContentCreateStore().createContentType(type, createInitOptions.value, true);
}
</script>

<template>
  <template v-if="showEditModal">
    <component
      :is="editModalComponent"
      v-if="editModel"
      v-model="showEditModal"
      :content="editModel"
      :type="editModel.type"
      :init-options="editInitOptions"
      @success="onUpdated"
      @cancel="onUpdateCanceled" />
  </template>
  <template v-if="showCreateModal">
    <component
      :is="createModalComponent"
      v-model="showCreateModal"
      :type="contentType"
      :init-options="createInitOptions"
      @success="onCreated"
      @cancel="onCreateCanceled">
      <template #navigation>
        <div v-if="showContentTypeMenu" class="flex justify-center p-2 shadow bg-highlight">
          <ly-slider-menu>
            <template
              v-for="contentTypeOption in getCreateContentTypes()"
              :key="contentTypeOption.type">
              <ly-button
                class="select-none button no-underline text-center rounded inline-block secondary outlined inline-flex items-center text-xs py-1 px-1 text-xs px-2 rounded"
                :active="contentTypeOption.type === contentType"
                @click="switchCreateContentType(contentTypeOption.type)">
                {{ translate(contentTypeOption.name) }}
              </ly-button>
            </template>
          </ly-slider-menu>
        </div>
      </template>
    </component>
  </template>
</template>

<style scoped></style>
