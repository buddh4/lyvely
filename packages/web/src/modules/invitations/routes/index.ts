import { translate } from '@/i18n';

export default [
  {
    path: '/mail-invite',
    name: 'MailInvite',
    meta: {
      i18n: { module: 'invitations' },
      title: () => translate('invitations.title'),
      isPublic: true,
    },
    component: () => import('../views/MailInvitationView.vue'),
  },
];
