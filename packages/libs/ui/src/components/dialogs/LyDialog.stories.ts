import type { Meta, StoryObj } from '@storybook/vue3';

import LyDialog from "./LyDialog.vue";

const meta = {
  title: 'Dialogs/Dialog',
  component: LyDialog,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: [],
  argTypes: {
    buttonType: {options: ['close', 'reload'], control: {type: 'radio' }},
  },
  args: {
    title: "Dialog Title",
    message: "This is a dialog!",
    icon: 'lyvely',
    iconClass: 'text-lyvely',
    buttonType: 'close',
    buttonText: 'Close',
    modelValue: true
  }

} satisfies Meta<typeof LyDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Dialog: Story = {};
