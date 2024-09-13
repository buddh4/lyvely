import type { Meta, StoryObj } from '@storybook/vue3';
import LyPicker from '@/components/forms/LyPicker.vue';
import { setTranslationProvider } from '@/i18n';

setTranslationProvider((test: any) => {
  if (test.plain) return test.plain;
  if (test === 'common.filter.search') return 'Search';
  if (test === 'common.select') return 'Select';
  if (test === 'common.submit') return 'Submit';
  return typeof test === 'string' ? test : test.toString();
});

const argTypes = {};

const meta: Meta<typeof LyPicker> = {
  title: 'Forms/BadgeChooser',
  component: LyPicker as any,
  tags: [],
  argTypes,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Picker: Story = {
  args: {
    label: 'Badges',
    modelValue: ['BadgeA'],
    provider: [
      { key: 'BadgeA', label: 'BadgeA' },
      { key: 'BadgeB', label: 'BadgeB' },
    ],
  },
};
