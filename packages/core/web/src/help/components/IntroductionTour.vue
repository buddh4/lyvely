<script lang="ts" setup>
import 'intro.js/minified/introjs.min.css';
import { storeToRefs } from 'pinia';
import { translate } from '@/i18n';
import { useIntroductionTourStore } from '@/help/stores/introduction-tour.store';
import HelpTour from '@/help/components/HelpTour.vue';

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
    element: document.querySelector('#account-menu')!,
    title: translate('help.intro.account_menu_title'),
    intro: `<p>${translate('help.intro.account_menu')}</p>`,
    position: 'bottom',
  },
] as Array<any>;
</script>

<template>
  <help-tour v-model="active" :steps="steps" />
</template>

<style scoped></style>
