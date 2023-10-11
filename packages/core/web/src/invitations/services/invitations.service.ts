import {
  IInvitationsService,
  MailInvitationInfo,
  InvitationRequest,
  UserInvitationInfo,
} from '@lyvely/core-interface';
import { useSingleton } from '@lyvely/common';
import repository from '../repositories/invitations.repository';
import { unwrapAndTransformResponse } from '@/core';

export class InvitationsService implements IInvitationsService {
  async sendInvitations(invite: InvitationRequest): Promise<void> {
    await repository.sendInvitations(invite);
  }

  async getMailInvitationInfo(token: string): Promise<MailInvitationInfo> {
    return unwrapAndTransformResponse(repository.getMailInvitationInfo(token), MailInvitationInfo);
  }

  async getUserInvitationInfo(pid: string): Promise<UserInvitationInfo> {
    return unwrapAndTransformResponse(repository.getUserInvitationInfo(pid), UserInvitationInfo);
  }

  async accept(pid: string): Promise<void> {
    await repository.accept(pid);
  }

  async decline(pid: string): Promise<void> {
    await repository.decline(pid);
  }
}

export const useInvitationsService = useSingleton(() => new InvitationsService());
