import type { Meta, StoryObj } from '@storybook/vue3';

import LyAlert from './LyAlert.vue';

const meta = {
  title: 'Example/Alerts',
  component: LyCenteredPanel,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: [],
  argTypes: {
    title: {control: {type: 'text'}},
    width: {options: ['xs', 'sm', 'lg', 'xl', 'full'], control: {type: 'select'}},
    icon:  {control: {type: 'text'}},
  },
  args: {
    title: "Some title",
    width: 'sm',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla metus libero, vestibulum quis libero a, pulvinar feugiat massa. Nam ipsum ante, vehicula id lorem in, posuere malesuada velit. ',
    icon: "lyvely",
  }

} satisfies Meta<typeof LyCenteredPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CenteredPanel: Story = {};
