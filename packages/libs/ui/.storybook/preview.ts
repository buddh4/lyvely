import type { Preview } from '@storybook/vue3';
import '../src/styles/tailwind.css';
import './variables.css';
import '../dist/style.css';
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
