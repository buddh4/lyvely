import type { Meta, StoryObj } from '@storybook/vue3';


import LyRange from './LyRange.vue';
import { setTranslationProvider } from "@/i18n";

setTranslationProvider((test) => {
  return typeof test === 'string' ? test : test.toString();
})

const argTypes = {
  "label ": {
    label: {
      category: 'slots',
    }
  },
  label: {
    description: '`string`',
    table: {
      category: 'props'
    }
  },
  required: { controls: 'boolean' },
  id: { table: { disable: true } },
  name: { table: { disable: true } },
  modelValue: { table: { disable: true } },
  value: { table: { disable: true } },
  property: { table: { disable: true } },
  inputClass: { table: { disable: true } },
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
}

const meta = {
  title: 'Forms/Range',
  component: LyRange,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: [],
  argTypes
} satisfies Meta<typeof LyRange>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Range: Story = {
  args: {
    label: 'Label',
    min: 0,
    max: 10
  },
};
