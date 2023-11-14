import type { Preview } from '@storybook/vue3';
import '../src/styles/index.css';
import 'animate.css/animate.css';
import './storybook.css';

const preview: Preview = {
  globalTypes: {
    darkMode: {},
    className: {}
  },
  parameters: {
    darkMode: {
      darkClass: "dark",
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
