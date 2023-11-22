import { buildTest, LyvelyTestingModule } from '@/testing';
import { profilesTestPlugin, ProfileTestDataUtils } from '@/profiles';
import { ProfileRelationRole, MailInvite, InvitationRequest } from '@lyvely/interface';
import { SendInvitationsService } from './send-invitations.service';
import { JwtModule } from '@nestjs/jwt';
import {
  Invitation,
  InvitationDao,
  InvitationSchema,
  MailInvitation,
  MailInvitationSchema,
  UserInvitation,
  UserInvitationSchema,
} from '../index';
import { ForbiddenServiceException } from '@lyvely/common';
import { mailTestPlugin, TestMailService } from '@/mails';
import { NotificationQueueTester, notificationTestPlugin } from '@/notifications';

describe('SendInvitations', () => {
  let testingModule: LyvelyTestingModule;
  let testData: ProfileTestDataUtils;
  let invitesService: SendInvitationsService;
  let notificationQueueTester: NotificationQueueTester;

  const TEST_KEY = 'invite_service';

  beforeEach(async () => {
    testingModule = await buildTest(TEST_KEY)
      .plugins([profilesTestPlugin, mailTestPlugin, notificationTestPlugin])
      .imports([JwtModule])
      .providers([SendInvitationsService, InvitationDao])
      .models([
        {
          name: Invitation.name,
          schema: InvitationSchema,
          discriminators: [
            { name: MailInvitation.name, schema: MailInvitationSchema },
            { name: UserInvitation.name, schema: UserInvitationSchema },
          ],
        },
      ])
      .compile();
    invitesService = testingModule.get(SendInvitationsService);
    testData = testingModule.get(ProfileTestDataUtils);
    notificationQueueTester = testingModule.get(NotificationQueueTester);
  });

  afterEach(async () => {
    return testingModule.afterEach();
  });

  afterAll(async () => {
    return testingModule.afterAll();
  });

  it('is defined', () => {
    expect(invitesService).toBeDefined();
  });

  describe('Invite new users to profile', () => {
    it('Member can send an invite to a non existing user', async () => {
      const { owner, profile } = await testData.createSimpleGroup();
      const result = await invitesService.sendInvitations(
        owner,
        new InvitationRequest({
          pid: profile.id,
          invites: [new MailInvite({ email: 'invited@mail.de' })],
        }),
      );

      expect(result.length).toEqual(1);
      expect(result[0] instanceof MailInvitation).toEqual(true);
      expect((<MailInvitation>result[0]).email).toEqual('invited@mail.de');
      expect(result[0].role).toEqual(ProfileRelationRole.Member);
      expect(result[0].pid).toEqual(profile._id);
      expect(result[0].token).toBeDefined();
      expect(result[0].createdBy).toEqual(owner._id);
      expect(TestMailService.sentMailOptions.length).toEqual(1);
      expect(TestMailService.sentMailOptions[0].to).toEqual('invited@mail.de');
    });

    it('Member can send an invite to an existing user', async () => {
      const user = await testData.createUser('someUser');
      const { owner, profile } = await testData.createSimpleGroup();
      const result = await invitesService.sendInvitations(
        owner,
        new InvitationRequest({
          pid: profile.id,
          invites: [new MailInvite({ email: user.email })],
        }),
      );

      expect(notificationQueueTester.notificationQueue.add).toHaveBeenCalledTimes(1);
      expect(result.length).toEqual(1);
    });

    it('User can not invite user to private profile', async () => {
      expect.assertions(1);
      const { user, profile } = await testData.createUserAndProfile();
      try {
        await invitesService.sendInvitations(
          user,
          new InvitationRequest({
            pid: profile.id,
            invites: [new MailInvite({ email: 'invited@mail.de' })],
          }),
        );
      } catch (e) {
        expect(e instanceof ForbiddenServiceException).toEqual(true);
      }
    });

    it('Invitations to members of the group are ignored', async () => {
      const { owner, member, profile } = await testData.createSimpleGroup();
      const result = await invitesService.sendInvitations(
        owner,
        new InvitationRequest({
          pid: profile.id,
          invites: [new MailInvite({ email: member.email })],
        }),
      );

      expect(result.length).toEqual(0);
    });

    it('Invitations to members of the group by secondary email are ignored', async () => {
      const { owner, member, profile } = await testData.createSimpleGroup();
      const result = await invitesService.sendInvitations(
        owner,
        new InvitationRequest({
          pid: profile.id,
          invites: [
            new MailInvite({ email: member.getVerifiedUserEmails()[1].email.toUpperCase() }),
          ],
        }),
      );

      expect(result.length).toEqual(0);
    });
  });

  describe('Invite new users to network', () => {
    it('User can send an invite to a non existing email', async () => {
      const user = await testData.createUser();
      const result = await invitesService.sendInvitations(
        user,
        new InvitationRequest({
          invites: [new MailInvite({ email: 'invited@mail.de' })],
        }),
      );

      expect(result.length).toEqual(1);
      expect(result[0] instanceof MailInvitation).toEqual(true);
      expect((<MailInvitation>result[0]).email).toEqual('invited@mail.de');
      expect(result[0].role).toEqual(ProfileRelationRole.Member);
      expect(result[0].pid).toBeUndefined();
      expect(result[0].token).toBeDefined();
      expect(result[0].createdBy).toEqual(user._id);
      expect(TestMailService.sentMailOptions.length).toEqual(1);
      expect(TestMailService.sentMailOptions[0].to).toEqual('invited@mail.de');
    });

    it('User can send an invite to an unverified existing email', async () => {
      const { owner, member } = await testData.createSimpleGroup();
      const result = await invitesService.sendInvitations(
        owner,
        new InvitationRequest({
          invites: [new MailInvite({ email: member.getUnverifiedUserEmails()[0].email })],
        }),
      );

      expect(result.length).toEqual(1);
      expect(TestMailService.sentMailOptions.length).toEqual(1);
      expect(TestMailService.sentMailOptions[0].to).toEqual(
        member.getUnverifiedUserEmails()[0].email,
      );
    });

    it('User can not invite himself', async () => {
      const { owner } = await testData.createSimpleGroup();
      const result = await invitesService.sendInvitations(
        owner,
        new InvitationRequest({
          invites: [new MailInvite({ email: owner.email.toUpperCase() })],
        }),
      );

      expect(result.length).toEqual(0);
      expect(TestMailService.sentMailOptions.length).toEqual(0);
    });

    it('User can not invite himself (secondary email)', async () => {
      const { owner } = await testData.createSimpleGroup();
      const result = await invitesService.sendInvitations(
        owner,
        new InvitationRequest({
          invites: [
            new MailInvite({ email: owner.getVerifiedUserEmails()[1].email.toUpperCase() }),
          ],
        }),
      );

      expect(result.length).toEqual(0);
      expect(TestMailService.sentMailOptions.length).toEqual(0);
    });

    it('User can not invite himself (unverified email)', async () => {
      const { owner } = await testData.createSimpleGroup();
      const result = await invitesService.sendInvitations(
        owner,
        new InvitationRequest({
          invites: [
            new MailInvite({ email: owner.getUnverifiedUserEmails()[0].email.toUpperCase() }),
          ],
        }),
      );

      expect(result.length).toEqual(0);
      expect(TestMailService.sentMailOptions.length).toEqual(0);
    });

    it('User can not invite himself (case sensitive)', async () => {
      const { owner } = await testData.createSimpleGroup();
      const result = await invitesService.sendInvitations(
        owner,
        new InvitationRequest({
          invites: [new MailInvite({ email: owner.email.toUpperCase() })],
        }),
      );

      expect(result.length).toEqual(0);
      expect(TestMailService.sentMailOptions.length).toEqual(0);
    });

    it('User can not invite an already confirmed main email', async () => {
      const { owner, member } = await testData.createSimpleGroup();
      const result = await invitesService.sendInvitations(
        owner,
        new InvitationRequest({
          invites: [new MailInvite({ email: member.email })],
        }),
      );

      expect(result.length).toEqual(0);
      expect(TestMailService.sentMailOptions.length).toEqual(0);
    });

    it('User can not invite an already confirmed main email (case sensitive)', async () => {
      const { owner, member } = await testData.createSimpleGroup();
      const result = await invitesService.sendInvitations(
        owner,
        new InvitationRequest({
          invites: [new MailInvite({ email: member.email.toUpperCase() })],
        }),
      );

      expect(result.length).toEqual(0);
      expect(TestMailService.sentMailOptions.length).toEqual(0);
    });

    it('User can not invite an already confirmed secondary email', async () => {
      const { owner, member } = await testData.createSimpleGroup();
      const result = await invitesService.sendInvitations(
        owner,
        new InvitationRequest({
          invites: [new MailInvite({ email: member.getVerifiedUserEmails()[1].email })],
        }),
      );

      expect(result.length).toEqual(0);
      expect(TestMailService.sentMailOptions.length).toEqual(0);
    });

    it('User can not invite an already confirmed secondary email (case sensitive)', async () => {
      const { owner, member } = await testData.createSimpleGroup();
      const result = await invitesService.sendInvitations(
        owner,
        new InvitationRequest({
          invites: [
            new MailInvite({ email: member.getVerifiedUserEmails()[1].email.toUpperCase() }),
          ],
        }),
      );

      expect(result.length).toEqual(0);
      expect(TestMailService.sentMailOptions.length).toEqual(0);
    });
  });

  describe('Invite non user', () => {
    it('Invite single non user with pid', async () => {
      const { owner, profile } = await testData.createSimpleGroup();
      const result = await invitesService.sendInvitations(
        owner,
        new InvitationRequest({
          pid: profile.id,
          invites: [new MailInvite({ email: 'test@mail.de' })],
        }),
      );

      expect(result.length).toEqual(1);
      expect((<MailInvitation>result[0]).email).toEqual('test@mail.de');
      expect(result[0].role).toEqual(ProfileRelationRole.Member);
      expect(result[0].pid).toEqual(profile._id);
      expect(result[0].token).toBeDefined();
      expect(result[0].createdBy).toEqual(owner._id);
    });
  });
});
