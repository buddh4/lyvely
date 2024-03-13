import LyModal from './LyModal.vue';
import { ref } from 'vue';

export default {
  title: 'Dialogs/Modal',
  component: LyModal,
  argTypes: {
    // Define controls for props, if needed
    width: {
      control: { type: 'select', options: ['md', 'lg', 'xl', '2xl', '3xl', '4xl', 'full'] },
    },
    // Other argTypes as needed
  },
};

const Template = (args: any) => ({
  components: { LyModal },
  setup() {
    const showModal = ref(true);
    return { args, showModal };
  },
  template: `
    <LyModal v-bind="args" v-model="showModal">
      This is the modal body!
    </LyModal>
  `,
});

export const Modal = Template.bind({});
(<any>Modal).args = {
  modelValue: true,
  form: true,
  title: 'Modal Title',
  cancelButtonText: 'Close',
  submitButtonText: 'Submit',
  // Set other default args as needed
};

// Additional stories for different states can be added here
