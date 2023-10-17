import { translate } from '@/i18n';

export default [
  {
    path: '/mail-invitation',
    name: 'MailInvite',
    meta: {
      i18n: { module: 'invitations' },
      title: () => translate('invitations.title'),
      isPublic: true,
      profileView: false,
    },
    component: () => import('../views/MailInvitationView.vue'),
  },
  {
    path: '/accept-invitation',
    name: 'AcceptInvitation',
    meta: {
      i18n: { module: 'invitations' },
      title: () => translate('invitations.accept.title'),
    },
    component: () => import('../views/AcceptInvitationView.vue'),
  },
];
