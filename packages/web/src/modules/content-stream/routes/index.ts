import { translation } from '@/i18n';
import { profileRoute } from '@/modules/profiles/routes/profile-route.util';
import { RouteLocation } from 'vue-router';
import { useContentStreamStore } from '@/modules/content-stream/stores/content-stream.store';

export default [
  {
    path: profileRoute('/stream'),
    name: 'Stream',
    meta: {
      layout: 'profile-xl',
      title: translation('stream.title'),
    },
    component: () => import('../views/ContentStreamView.vue'),
  },
  {
    path: profileRoute('/c/:cid'),
    name: 'ContentDetails',
    beforeEnter: [
      (to: RouteLocation) => {
        const streamStore = useContentStreamStore();
        streamStore.setParentId(to.params.cid as string);
      },
    ],
    meta: {
      layout: 'profile-xl',
      title: translation('stream.title'),
    },
    component: () => import('../views/ContentDetailView.vue'),
  },
];
