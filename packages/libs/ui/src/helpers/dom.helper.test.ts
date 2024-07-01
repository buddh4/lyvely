import { mount } from '@vue/test-utils';
import { describe, test, expect, beforeEach } from 'vitest';
import { findDfi } from "./dom.helper";

beforeEach(() => {});

describe('findDfi', () => {
  test('find no element found', async () => {
    const wrapper = mount({
      template: '<div class="root"><div class="search"></div></div>',
      setup() {},
    });

    const root = wrapper.find('.root');
    const search = wrapper.find('.search');

    const result = findDfi(root.element, search.element, 'ul');
    expect(result).toEqual(-1);
  });

  test('find dfi on first item', async () => {
    const wrapper = mount({
      template: '<div class="root"><ul class="list"><li>Test</li></ul></div>',
      setup() {},
    });

    const root = wrapper.find('.root');
    const list = wrapper.find('.list');

    const result = findDfi(root.element, list.element, 'ul');
    expect(result).toEqual(0);
  });

  test('find dfi on first wrapped item', async () => {
    const wrapper = mount({
      template: '<div class="root"><ul><li>Test<ul class="list"><li>Test2</li></ul></li></ul></div>',
      setup() {},
    });

    const root = wrapper.find('.root');
    const list = wrapper.find('.list');

    const result = findDfi(root.element, list.element, 'ul');
    expect(result).toEqual(1);
  });

  test('find dfi from child', async () => {
    const wrapper = mount({
      template: '<div class="root"><ul><li>Test<ul><li class="child">Test2</li></ul></li></ul></div>',
      setup() {},
    });

    const root = wrapper.find('.root');
    const child = wrapper.find('.child');

    const result = findDfi(root.element, child.element, 'ul');
    expect(result).toEqual(1);
  });

  test('find dfi on second wrapped item', async () => {
    const wrapper = mount({
      template: '<div class="root"><ul><li>Test<ul><li>Test2</li></ul></li><li>Test<ul class="list"><li>Test2</li></ul></li></ul></div>',
      setup() {},
    });

    const root = wrapper.find('.root');
    const list = wrapper.find('.list');

    const result = findDfi(root.element, list.element, 'ul');
    expect(result).toEqual(2);
  });

  test('find dfi on second wrapped item from child', async () => {
    const wrapper = mount({
      template: '<div class="root"><ul><li>Test<ul><li>Test2</li></ul></li><li>Test<ul><li class="child">Test2</li></ul></li></ul></div>',
      setup() {},
    });

    const root = wrapper.find('.root');
    const child = wrapper.find('.child');

    const result = findDfi(root.element, child.element, 'ul');
    expect(result).toEqual(2);
  });
});


