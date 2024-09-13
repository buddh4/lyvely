import type { Meta, StoryObj } from '@storybook/vue3';

import LyBadge from './LyBadge.vue';

const meta: Meta<typeof LyBadge> = {
  title: 'Example/Badges',
  component: LyBadge,
  tags: [],
  argTypes: {
    color: { control: { type: 'color' } },
    textColor: { control: { type: 'color' } },
  },
  args: {
    modelValue: true,
    text: 'Badge',
    color: '#0060df',
    clickable: false,
    closable: false,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Badge: Story = {};
