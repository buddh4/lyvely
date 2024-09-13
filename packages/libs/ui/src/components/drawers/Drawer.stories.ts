import type { Meta, StoryObj } from '@storybook/vue3';

import LyDrawer from './LyDrawer.vue';

const meta: Meta<typeof LyDrawer> = {
  title: 'Example/Drawer',
  component: LyDrawer,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: [],
  argTypes: {},
  args: {
    modelValue: true,
    title: 'This is Drawer',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Drawer: Story = {};
