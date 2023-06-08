import LyCenteredLayout from '@/components/layouts/LyCenteredLayout.vue';
import LyContentRoot from '@/components/layouts/LyContentRoot.vue';
import LyListPage from '@/components/layouts/LyListPage.vue';
import LyMainContainer from '@/components/layouts/LyMainContainer.vue';
import { setTranslationProvider, TranslationAdapter } from './i18n';
import { App } from 'vue';

type LyvelyUiOptions = {
  translationProvider?: TranslationAdapter;
};

const createLyvelyUi = (options?: LyvelyUiOptions) => {
  if (options?.translationProvider) {
    setTranslationProvider(options.translationProvider);
  }

  return {
    install(Vue: App) {
      // Layouts
      Vue.component('LyCenteredLayout', LyCenteredLayout);
      Vue.component('LyContentRoot', LyContentRoot);
      Vue.component('LyListPage', LyListPage);
      Vue.component('LyMainContainer', LyMainContainer);
    },
  };
};

export {
  createLyvelyUi,
  LyCenteredLayout,
  LyContentRoot,
  LyListPage,
  LyMainContainer,
  setTranslationProvider,
};
