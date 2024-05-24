import type { Meta, StoryObj } from '@storybook/vue3';

import LyCheckbox from '@/components/forms/LyCheckbox.vue';
import { setTranslationProvider } from '@/i18n';

setTranslationProvider((test) => {
  if (test === 'common.edit') return 'Edit';
  if (test === 'common.cancel') return 'Cancel';
  if (test === 'common.submit') return 'Submit';
  return typeof test === 'string' ? test : test.toString();
});

const argTypes = {
  'label ': {
    label: {
      category: 'slots',
    },
  },
  label: {
    description: '`string`',
    table: {
      category: 'props',
    },
  },
  inputClass: { options: ['warning', 'success', 'primary', 'info', 'danger'] },
  required: { controls: 'boolean' },
  id: { table: { disable: true } },
  name: { table: { disable: true } },
  checked: { table: { disable: true } },
  value: { table: { disable: true } },
  property: { table: { disable: true } },
  error: { table: { disable: true } },
  readonly: { table: { disable: true } },
  placeholder: { table: { disable: true } },
  inputStyle: { table: { disable: true } },
  wrapperClass: { table: { disable: true } },
  autofocus: { table: { disable: true } },
  autocomplete: { table: { disable: true } },
  ariaDescribedby: { table: { disable: true } },
  autoValidation: { table: { disable: true } },
  type: { table: { disable: true } },
  passwordToggle: { table: { disable: true } },
  loading: { table: { disable: true } },
  helpText: { table: { disable: true } },
};

const meta = {
  title: 'Forms/Checkbox',
  component: LyCheckbox,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: [],
  argTypes,
} satisfies Meta<typeof LyCheckbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Checkbox: Story = {
  args: {
    label: 'Label',
    disabled: false,
    readonly: false,
  },
};
