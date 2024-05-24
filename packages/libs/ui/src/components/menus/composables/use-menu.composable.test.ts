import { mount } from '@vue/test-utils';
import { test, expect, beforeEach } from 'vitest';
import { ref } from 'vue';
import { useMenu } from './use-menu.composable';
import { clearMenu, registerMenuEntry } from '@/components/menus'; // Replace with the actual path to your composable

beforeEach(() => {
  clearMenu('test');
});

test('useMenu Composable - should reactively update enabledMenuEntries when context changes', async () => {
  // Create a mock context ref
  const userName = ref({ name: 'John' });

  registerMenuEntry('test', () => {
    return {
      id: 'test',
      moduleId: 'test',
      text: `Hello ${userName.value.name}`,
      click: () => {},
    };
  });

  const wrapper = mount({
    template: '<div>{{ enabledMenuEntries[0].text }}</div>',
    setup() {
      const { enabledMenuEntries } = useMenu('test');

      return { enabledMenuEntries };
    },
  });

  // Ensure that the enabled menu entries are initially based on the context
  expect(wrapper.text()).toContain('Hello John');

  // Update the context data
  userName.value.name = 'Jane';

  // Wait for Vue to update and re-render
  await wrapper.vm.$nextTick();

  // Ensure that the enabled menu entries have reactively updated based on the new context data
  expect(wrapper.text()).toContain('Hello Jane');
});

test('useMenu Composable - should reactively update hasEnabledEntries when menu entries change', async () => {
  registerMenuEntry('test', () => {
    return {
      id: 'test',
      moduleId: 'test',
      text: '',
      click: () => {},
    };
  });

  const wrapper = mount({
    template: '<div>Length: {{ enabledMenuEntries.length }}</div>',
    setup() {
      const { enabledMenuEntries } = useMenu('test');

      return { enabledMenuEntries };
    },
  });

  // Ensure that the enabled menu entries are initially based on the context
  expect(wrapper.text()).toContain('Length: 1');

  // Update the context data
  registerMenuEntry('test', () => {
    return {
      id: 'test2',
      moduleId: 'test',
      text: '',
      click: () => {},
    };
  });

  // Wait for Vue to update and re-render
  await wrapper.vm.$nextTick();

  // Ensure that the enabled menu entries have reactively updated based on the new context data
  expect(wrapper.text()).toContain('Length: 2');
});
