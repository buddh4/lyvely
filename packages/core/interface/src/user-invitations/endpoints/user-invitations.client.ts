import { IUserInvitationsClient } from './user-invitations.endpoint';
import { InvitationRequest, MailInvitationInfo, UserInvitationInfo } from '../models';
import { useSingleton } from '@lyvely/common';
import repository from './user-invitations.repository';
import { unwrapAndTransformResponse } from '@/endpoints';

export class UserInvitationsClient implements IUserInvitationsClient {
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

export const useUserInvitationsClient = useSingleton(() => new UserInvitationsClient());
