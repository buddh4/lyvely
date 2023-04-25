import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { createBasicTestingModule, TestDataUtils } from '@/test';
import { UserInvitesService } from './user-invites.service';
import { JwtModule } from '@nestjs/jwt';
import { UserInviteDao } from '@/user-invites/daos/user-invite.dao';
import { UserInvite, UserInviteSchema } from '@/user-invites/schemas';
import { BaseProfileRelationRole, MailInvite, UserInvites } from '@lyvely/common';

describe('UserInviteService', () => {
  let testingModule: TestingModule;
  let testData: TestDataUtils;
  let invitesService: UserInvitesService;

  const TEST_KEY = 'invite_service';

  beforeEach(async () => {
    testingModule = await createBasicTestingModule(
      TEST_KEY,
      [UserInvitesService, UserInviteDao],
      [{ name: UserInvite.name, schema: UserInviteSchema }],
      [JwtModule],
    ).compile();
    invitesService = testingModule.get(UserInvitesService);
    testData = testingModule.get(TestDataUtils);
  });

  it('is defined', () => {
    expect(invitesService).toBeDefined();
  });

  describe('Invite non user', () => {
    it('Invite single non user without pid', async () => {
      const user = await testData.createUser();
      const result = await invitesService.inviteUsers(
        user,
        new UserInvites({
          invites: [new MailInvite({ email: 'test@mail.de' })],
        }),
      );

      expect(result.length).toEqual(1);
      expect(result[0].email).toEqual('test@mail.de');
      expect(result[0].role).toBeUndefined();
      expect(result[0].pid).toBeUndefined();
      expect(result[0].token).toBeDefined();
      expect(result[0].createdBy).toEqual(user._id);
    });

    it('Invite single non user with pid', async () => {
      const { owner, profile } = await testData.createSimpleGroup();
      const result = await invitesService.inviteUsers(
        owner,
        new UserInvites({
          pid: profile.id,
          invites: [new MailInvite({ email: 'test@mail.de' })],
        }),
      );

      expect(result.length).toEqual(1);
      expect(result[0].email).toEqual('test@mail.de');
      expect(result[0].role).toEqual(BaseProfileRelationRole.Member);
      expect(result[0].pid).toEqual(profile._id);
      expect(result[0].token).toBeDefined();
      expect(result[0].createdBy).toEqual(owner._id);
    });
  });
});
