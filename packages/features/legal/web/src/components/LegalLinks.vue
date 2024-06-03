<script setup lang="ts">
import { useAppConfigStore } from '@lyvely/web';
import { ref } from 'vue';
import {
  LegalSection,
  LegalSectionDetails,
  ILegalAppConfig,
  useLegalClient,
} from '@lyvely/legal-interface';
import { LyLoader, LyModal } from '@lyvely/ui';

const sections = useAppConfigStore().getModuleConfig<ILegalAppConfig>('legal', 'sections');
const showLegalModal = ref(false);
const activeSection = ref<LegalSection>();
const activeSectionDetails = ref<LegalSectionDetails>();
const details = {} as { [id: string]: LegalSectionDetails };
const loading = ref(false);
const client = useLegalClient();

function setActiveSection(section: LegalSection) {
  if (!section) return;

  activeSection.value = section;

  if (details[section.id]) {
    activeSectionDetails.value = details[section.id];
  } else {
    loading.value = true;
    showLegalModal.value = true;
    client.getLegalDetails(section.id).then((sectionDetails) => {
      activeSectionDetails.value = details[section.id] = sectionDetails;
      loading.value = false;
    });
  }

  showLegalModal.value = true;
}
</script>

<template>
  <div class="flex flex-wrap items-center justify-center gap-x-1">
    <template v-for="(section, index) in sections" :key="section.id">
      <span v-if="index > 0">&middot;</span>
      <a v-if="!!section.url" class="text-xs text-main" target="_blank" :href="section.url">{{
        section.label
      }}</a>
      <a v-else class="text-xs text-main" href="#" @click="setActiveSection(section)">{{
        section.label
      }}</a>
    </template>
  </div>
  <ly-modal
    v-model="showLegalModal"
    icon="lyvely"
    icon-class="text-lyvely"
    :is-loading="loading"
    :title="activeSection?.label || ''"
    :cancel-button="false"
    submit-button-text="common.close"
    width="4xl"
    @submit="showLegalModal = false">
    <template #default>
      <ly-loader v-if="loading" />
      <template v-else-if="activeSectionDetails">
        <template v-if="activeSectionDetails.format === 'html'">
          <div class="prose-sm" v-html="activeSectionDetails.content"></div>
        </template>
        <template v-else>
          {{ activeSectionDetails.content }}
        </template>
      </template>
    </template>
  </ly-modal>
</template>

<style scoped></style>
