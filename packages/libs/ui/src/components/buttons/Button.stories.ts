import type { Meta, StoryObj } from '@storybook/vue3';

import LyButton from './LyButton.vue';

const meta = {
  title: 'Example/Button',
  component: LyButton,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: [],
  argTypes: {
    outlined: { control: 'boolean' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
  args: {
    outlined: false,
    disabled: false,
    loading: false
  }

} satisfies Meta<typeof LyButton & { outlined?: boolean }>;

export default meta;
type Story = StoryObj<typeof meta & { outlined?: boolean }>;

export const Primary: Story = {
  args: {
    class: 'primary',
    text: 'Primary',
  },
};

export const Secondary: Story = {
  args: {
    class: 'secondary',
    text: 'Secondary',
  },
};

export const Info: Story = {
  args: {
    class: 'info',
    text: 'Info',
  },
};

export const Success: Story = {
  args: {
    class: 'success',
    text: 'Success',
  },
};

export const Warning: Story = {
  args: {
    class: 'warning',
    text: 'Warning',
  },
};

export const Danger: Story = {
  args: {
    class: 'danger',
    text: 'Danger',
  },
};
