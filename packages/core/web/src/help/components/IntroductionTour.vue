<script lang="ts" setup>
import 'intro.js/minified/introjs.min.css';
import { storeToRefs } from 'pinia';
import { translate } from '@/i18n';
import { useIntroductionTourStore } from '../stores';
import HelpTour from './HelpTour.vue';

const introductionTourStore = useIntroductionTourStore();
const { active } = storeToRefs(introductionTourStore);

const steps = [
  {
    element: document.querySelector('[data-id="profile-combo-button"]')!,
    title: translate('help.intro.profile_combo_button_title'),
    intro: `<p>${translate('help.intro.profile_combo_button1')}</p>
            <p>${translate('help.intro.profile_combo_button2')}</p>
            <p>${translate('help.intro.profile_combo_button3')}</p>`,
    position: 'bottom',
  },
  {
    element: document.querySelector('[data-id="profile-drawer"]')!,
    title: translate('help.intro.profile_sidebar_title'),
    intro: `<p>${translate('help.intro.profile_sidebar1')}</p>
            <p>${translate('help.intro.profile_sidebar2')}</p>`,
    position: 'right',
  },
  {
    element: document.querySelector("[data-id='profile-breadcrumb']")!,
    title: translate('help.intro.profile_breadcrumb_title'),
    intro: `<p>${translate('help.intro.profile_breadcrumb')}</p>`,
    position: 'bottom',
  },
  {
    element: document.querySelector("[data-id='btn-account-drawer']")!,
    title: translate('help.intro.account_menu_title'),
    intro: `<p>${translate('help.intro.account_menu')}</p>`,
    position: 'bottom',
  },
] as Array<any>;

// Note: Somehow we need the hidden div, otherwise the modelValue is not synced.
</script>

<template>
  <help-tour v-model="active" :steps="steps" />
  <div class="hidden"></div>
</template>

<style scoped></style>
