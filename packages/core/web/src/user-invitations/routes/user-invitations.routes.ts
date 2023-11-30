import { translate } from '@/i18n';
import { LAYOUT_INTRO } from '@/ui';

export default [
  {
    path: '/mail-invitation',
    name: 'MailInvite',
    meta: {
      i18n: {
        load: ['user-invitations'],
      },
      title: () => translate('invitations.title'),
      visibility: true,
      layout: LAYOUT_INTRO,
    },
    component: () => import('../views/MailInvitationView.vue'),
  },
  {
    path: '/accept-invitation',
    name: 'AcceptInvitation',
    meta: {
      i18n: {
        load: ['user-invitations'],
      },
      title: () => translate('invitations.accept.title'),
    },
    component: () => import('../views/AcceptInvitationView.vue'),
  },
];
