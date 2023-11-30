import { Forbidden, NotFound, Error } from '../views';

export const uiRoutes = [
  {
    path: '/403',
    name: 'Forbidden',
    component: Forbidden,
    meta: {
      isPublic: true,
    },
  },
  {
    path: '/500',
    name: 'Error',
    component: Error,
    meta: {
      isPublic: true,
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
