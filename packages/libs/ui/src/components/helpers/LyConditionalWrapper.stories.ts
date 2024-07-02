import LyConditionalWrapper from './LyConditionalWrapper.vue';
import LyAlert from '../dialogs/LyAlert.vue';

export default {
  title: 'Helpers/ConditionalWrapper',
  component: LyConditionalWrapper,
  argTypes: {
    tag: {
      control: { type: 'text' },
    },
  },
};

const Template = (args: any) => ({
  components: { LyConditionalWrapper, LyAlert },
  setup() {
    return { args };
  },
  template: `
    <LyConditionalWrapper v-bind="args">
      <div>This is some content that will be conditionally wrapped.</div>
    </LyConditionalWrapper>
  `,
});

export const Component = Template.bind({});
(Component as any).args = {
  if: true,
  tag: LyAlert,
};

export const Tag = Template.bind({});
(Tag as any).args = {
  if: true,
  tag: 's',
};
