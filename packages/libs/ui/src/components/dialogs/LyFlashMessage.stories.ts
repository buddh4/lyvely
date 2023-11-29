import type { Meta, StoryObj } from '@storybook/vue3';

import LyFlashMessage from './LyFlashMessage.vue';

const meta = {
  title: 'Dialogs/FlashMessage',
  component: LyFlashMessage,
  tags: [],
  argTypes: {
    modelValue: {control: 'boolean'},
    type: {options: ['danger', 'info', 'warning', 'success'], control: {type: 'radio'}},
  },
  args: {
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla metus libero, vestibulum quis libero a, pulvinar feugiat massa. Nam ipsum ante, vehicula id lorem in, posuere malesuada velit. ',
    modelValue: true,
    manual: true
  }

} satisfies Meta<typeof LyFlashMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FlashMessage: Story = {};
