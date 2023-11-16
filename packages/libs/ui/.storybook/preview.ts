import type { Preview } from '@storybook/vue3';
//import '../../../core/web/src/styles/index.css';
import './storybook.css';

const preview: Preview = {
  globalTypes: {
    darkMode: {},
    className: {},
  },
  parameters: {
    darkMode: {
      darkClass: 'dark',
      stylePreview: true,
    },
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
