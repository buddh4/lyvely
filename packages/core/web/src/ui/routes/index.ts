import { Forbidden, NotFound, Error } from '../components';

export const uiRoutes = [
  {
    path: '/403',
    name: 'Forbidden',
    component: Forbidden,
    meta: {
      isPublic: true,
      profileView: false,
    },
  },
  {
    path: '/500',
    name: 'Error',
    component: Error,
    meta: {
      isPublic: true,
      profileView: false,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: {
      isPublic: true,
      profileView: false,
    },
  },
];
