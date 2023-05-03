import {
  IInvitationsService,
  MailInvitationInfo,
  InvitationRequest,
  useSingleton,
} from '@lyvely/common';
import repository from '../repositories/invitations.repository';
import { unwrapAndTransformResponse } from '@/modules/core';

export class InvitationsService implements IInvitationsService {
  async sendInvitations(invite: InvitationRequest): Promise<void> {
    await repository.sendInvitations(invite);
  }

  async getMailInvitationInfo(token: string): Promise<MailInvitationInfo> {
    return unwrapAndTransformResponse(repository.getMailInvitationInfo(token), MailInvitationInfo);
  }
}

export const useInvitationsService = useSingleton(() => new InvitationsService());
