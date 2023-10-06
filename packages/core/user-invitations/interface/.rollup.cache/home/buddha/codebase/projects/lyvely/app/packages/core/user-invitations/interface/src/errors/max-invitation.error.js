import { ServiceException } from '@lyvely/common';
export class MaxInvitationError extends ServiceException {
    constructor(allowed) {
        super({ allowed }, 'max_invitation_limit');
        this.status = 403;
    }
}
