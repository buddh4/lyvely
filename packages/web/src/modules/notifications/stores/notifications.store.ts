import { defineStore } from 'pinia';
import { ref } from 'vue';
import { IWebNotification } from '@lyvely/common';

export const useNotificationStore = defineStore('notifications', () => {
  const showNotificationDrawer = ref(false);

  const notifications: IWebNotification[] = [
    {
      id: '1',
      seen: true,
      type: 'someNotification',
      title: 'Test1',
      source: {
        guid: '93bd1fad6755d38bc66ab7e683ace231983d855bac75a889a7f0782e915d9b1a',
        name: 'buddha',
      },
      route: {
        pid: '632acd719ee459823d365ba9',
        path: '/activities',
      },
      body: 'This is a <b>Test</b>, someone did something you are interested in.',
    },
    {
      id: '2',
      seen: false,
      type: 'someNotification',
      title: 'Test2',
      source: {
        guid: '93bd1fad6755d38bc66ab7e683ace231983d855bac75a889a7f0782e915d9b1a',
        name: 'buddha',
      },
      route: {
        pid: '632acd719ee459823d365ba9',
        path: '/activities',
      },
      body: 'This is a <b>Test</b>',
    },
    {
      id: '3',
      seen: true,
      type: 'someNotification',
      title: 'Test3',
      source: {
        guid: '93bd1fad6755d38bc66ab7e683ace231983d855bac75a889a7f0782e915d9b1a',
        name: 'buddha',
      },
      route: {
        pid: '632acd719ee459823d365ba9',
        path: '/activities',
      },
      body: 'This is a <b>Test</b>',
    },
    {
      id: '4',
      seen: true,
      type: 'someNotification',
      title: 'Test4',
      source: {
        guid: '93bd1fad6755d38bc66ab7e683ace231983d855bac75a889a7f0782e915d9b1a',
        name: 'buddha',
      },
      route: {
        pid: '632acd719ee459823d365ba9',
        path: '/activities',
      },
      body: 'This is a <b>Test</b>',
    },
  ];

  return {
    showNotificationDrawer,
    notifications,
  };
});
