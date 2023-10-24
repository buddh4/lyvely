import { RouteLocation, NavigationGuardNext } from 'vue-router';
import { isMongoId } from 'class-validator';
import { useNotificationStore } from '@/notifications/stores/notifications.store';

export default [
  {
    path: '/notification',
    name: 'Notification',
    beforeEnter: [
      async (to: RouteLocation, from: RouteLocation, next: NavigationGuardNext) => {
        if (!to.query.nid) next('/');
        if (!isMongoId(to.query.nid)) next('/');
        const notification = await useNotificationStore().loadEntry(to.query.nid as string);
        if (notification?.route) {
          next(notification.route);
        } else {
          next('/');
        }
      },
    ],
  },
];
