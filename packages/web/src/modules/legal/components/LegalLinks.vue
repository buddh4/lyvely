<script setup lang="ts">
import { useAppConfigStore } from '@/modules/app-config/store/app-config.store';
import { ref, watch } from 'vue';
import { LegalSection, LegalSectionDetails } from '@lyvely/common';
import LyLoader from '@/modules/ui/components/loader/LoaderBlock.vue';
import { useLegalService } from '@/modules/legal/services/legal.service';

const { get } = useAppConfigStore();

const sections = get('legal');
const showLegalModal = ref(false);
const activeSection = ref<LegalSection>();
const activeSectionDetails = ref<LegalSectionDetails>();
const details = {};
const loading = ref(false);
const legalService = useLegalService();

function setActiveSection(section: LegalSection) {
  if (!section) return;

  activeSection.value = section;

  if (details[section.id]) {
    activeSectionDetails.value = details[section.id];
  } else {
    loading.value = true;
    showLegalModal.value = true;
    legalService.getLegalDetails(section.id).then((sectionDetails) => {
      activeSectionDetails.value = details[section.id] = sectionDetails;
      loading.value = false;
    });
  }

  showLegalModal.value = true;
}
</script>

<template>
  <div class="flex justify-center items-center gap-1 flex-wrap">
    <template v-for="(section, index) in sections" :key="section.id">
      <span v-if="index > 0">&middot;</span>
      <a class="text-xs" href="#" @click="setActiveSection(section)">{{ section.label }}</a>
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
