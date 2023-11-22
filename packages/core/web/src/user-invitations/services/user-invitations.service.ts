import {
  IUserInvitationsService,
  MailInvitationInfo,
  InvitationRequest,
  UserInvitationInfo,
} from '@lyvely/interface';
import { useSingleton } from '@lyvely/common';
import repository from '../repositories/invitations.repository';
import { unwrapAndTransformResponse } from '@/core';

export class UserInvitationsService implements IUserInvitationsService {
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

export const useUserInvitationsService = useSingleton(() => new UserInvitationsService());
