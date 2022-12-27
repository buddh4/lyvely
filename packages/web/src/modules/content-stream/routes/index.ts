import { translation } from '@/i18n';
import { profileRoute } from '@/modules/profiles/routes/profile-route.util';
import { ContentModel } from '@lyvely/common';

export function contentRoute(pid: string, cid: string) {
  return profileRoute(`/stream/${cid}`, pid);
}

export function toContentDetails(content: ContentModel) {
  return contentRoute(content.pid, content.id);
}

export default [
  {
    path: profileRoute('/stream'),
    component: import('../views/ContentStreamRootView.vue'),
    layout: 'profile-full',
    children: [
      {
        path: '',
        name: 'stream',
        component: import('../views/ContentStreamView.vue'),
        meta: {
          layout: 'profile-full',
          title: translation('stream.title'),
          breadcrumb: [translation('stream.breadcrumb.stream')],
        },
      },
      {
        path: ':cid',
        name: 'content-details',
        component: import('../views/ContentDetailView.vue'),
        meta: {
          layout: 'profile-full',
          title: translation('stream.title'),
          breadcrumb: [
            translation('stream.breadcrumb.stream'),
            translation('stream.breadcrumb.content_details'),
          ],
        },
      },
    ],
  },
];
