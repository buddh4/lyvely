<script lang="ts" setup>
import { useAuthStore } from '@/modules/auth/store/auth.store';
import { useHelpStore } from '@/modules/help/stores/help.store';
import { storeToRefs } from 'pinia';
import { isToday } from '@lyvely/dates';
import ms from 'ms';
import { useAppConfigStore } from '@/modules/app-config/store/app-config.store';
import { useIntroductionTourStore } from '@/modules/help/stores/introduction-tour.store';
import { computed } from 'vue';

const authStore = useAuthStore();
const helpStore = useHelpStore();
const introductionTourStore = useIntroductionTourStore();
const appConfigStore = useAppConfigStore();

const { showModal } = storeToRefs(helpStore);

const appName = appConfigStore.get('appName');
const isNewUser =
  authStore.user &&
  (isToday(authStore.user.createdAt) || Date.now() - authStore.user.createdAt.getTime() < ms('2h'));
const title = isNewUser ? 'help.modal.title_new' : 'help.modal.title';

function startIntroTour() {
  showModal.value = false;
  introductionTourStore.startTour();
}

const docUrl = computed(() => appConfigStore.get('docUrl', 'https://docs.lyvely.app'));

function toDocs() {
  showModal.value = false;
  window.open(docUrl.value, '_blank');
}
</script>

<template>
  <ly-modal v-model="showModal" icon="help" icon-class="text-info-dark" title="help.modal.title">
    <template #title>
      {{ $t(title, { appName }) }}
    </template>

    <i18n-t
      v-if="isNewUser"
      keypath="help.modal.text_intro"
      tag="p"
      class="text-center text-dimmed text-sm mb-5">
      <template #appName>
        {{ appName }}
      </template>
      <template #introductionLink>
        <a class="cursor-pointer" @click="startIntroTour">{{
          $t('help.modal.introductionLinkText')
        }}</a>
      </template>
      <template #docLink>
        <a class="cursor-pointer" @click="toDocs">{{ docUrl }}</a>
      </template>
    </i18n-t>

    <div class="flex flex-col space-y-1">
      <ly-button label="help.modal.buttons.intro" class="primary" @click="startIntroTour" />
      <ly-button class="primary flex items-center justify-center" @click="toDocs">
        {{ $t('help.modal.buttons.to_docs') }}
        <ly-icon name="external_link" class="ml-1" />
      </ly-button>
    </div>
  </ly-modal>
</template>

<style scoped></style>
