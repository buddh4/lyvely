import type { Meta, StoryObj } from '@storybook/vue3';

import LyAlert from './LyAlert.vue';

const meta = {
  title: 'Dialogs/Alert',
  component: LyAlert,
  tags: [],
  argTypes: {
    type: {options: ['danger', 'info', 'warning', 'secondary', 'success'], control: {type: 'radio'}},
    icon: {control: 'boolean'},
    closable: {control: 'boolean'}
  },
  args: {
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla metus libero, vestibulum quis libero a, pulvinar feugiat massa. Nam ipsum ante, vehicula id lorem in, posuere malesuada velit. ',
    type: 'info',
    icon: false,
    modelValue: true,
    closable: false,
  }

} satisfies Meta<typeof LyAlert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Alert: Story = {};
