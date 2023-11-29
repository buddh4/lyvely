import type { Meta, StoryObj } from '@storybook/vue3';
import LyBadgeChooser from "@/components/forms/LyBadgeChooser.vue";
import { setTranslationProvider } from "@/i18n";

setTranslationProvider((test: any) => {
  if(test.plain) return test.plain;
  if(test === 'common.filter.search') return 'Search';
  if(test === 'common.select') return 'Select';
  if(test === 'common.submit') return 'Submit';
  return typeof test === 'string' ? test : test.toString();
})

const argTypes = {
}

const meta = {
  title: 'Forms/BadgeChooser',
  component: LyBadgeChooser,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: [],
  argTypes
} satisfies Meta<typeof LyBadgeChooser>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BadgeChooser: Story = {
  args: {
    label: 'Badges',
    modelValue: ['BadgeA'],
    options: ['BadgeA', 'BadgeB']
  },
};
