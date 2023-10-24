import { translation } from '@/i18n';
import { profileRoute } from '@/profiles/routes/profile-route.util';
import { RouteRecordRaw } from 'vue-router';

export const contentRoutes = [
  {
    name: 'Stream',
    path: profileRoute('/stream'),
    component: () => import('../views/ContentStreamLayout.vue'),
    meta: {
      layout: 'profile-full',
    },
    children: [
      {
        path: '',
        name: 'stream',
        component: () => import('../views/ContentStreamView.vue'),
        meta: {
          layout: 'profile-full',
          title: translation('stream.title'),
          breadcrumb: [translation('stream.breadcrumb.stream')],
          showMobileFooter: false,
        },
      },
      {
        path: ':cid',
        name: 'content-details',
        component: () => import('../views/ContentDetailsView.vue'),
        meta: {
          layout: 'profile-full',
          title: translation('stream.title'),
          baseName: 'stream',
          showMobileFooter: false,
          breadcrumb: [
            translation('stream.breadcrumb.stream'),
            translation('stream.breadcrumb.content_details'),
          ],
        },
      },
    ],
  },
] as Array<RouteRecordRaw>;
