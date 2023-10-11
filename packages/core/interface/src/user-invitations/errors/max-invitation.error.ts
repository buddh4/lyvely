import { ServiceException } from '@lyvely/common';

export class MaxInvitationError extends ServiceException {
  constructor(allowed: number) {
    super({ allowed }, 'max_invitation_limit');
    this.status = 403;
  }
}
