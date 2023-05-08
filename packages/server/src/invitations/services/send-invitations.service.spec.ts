import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { createBasicTestingModule, TestDataUtils } from '@/test';
import { SendInvitationsService } from './send-invitations.service';
import { JwtModule } from '@nestjs/jwt';
import { InvitationDao } from '@/invitations/daos/invitation.dao';
import {
  Invitation,
  InvitationSchema,
  MailInvitation,
  MailInvitationSchema,
  UserInvitation,
  UserInvitationSchema,
} from '@/invitations/schemas';
import { BaseProfileRelationRole, MailInvite, InvitationRequest } from '@lyvely/common';
import { TestMailService } from '@/mails';

describe('SendInvitations', () => {
  let testingModule: TestingModule;
  let testData: TestDataUtils;
  let invitesService: SendInvitationsService;

  const TEST_KEY = 'invite_service';

  beforeEach(async () => {
    testingModule = await createBasicTestingModule(
      TEST_KEY,
      [SendInvitationsService, InvitationDao],
      [
        {
          name: Invitation.name,
          schema: InvitationSchema,
          discriminators: [
            { name: MailInvitation.name, schema: MailInvitationSchema },
            { name: UserInvitation.name, schema: UserInvitationSchema },
          ],
        },
      ],

      [JwtModule],
    ).compile();
    invitesService = testingModule.get(SendInvitationsService);
    testData = testingModule.get(TestDataUtils);
  });

  it('is defined', () => {
    expect(invitesService).toBeDefined();
  });

  describe('Invite new users to network', () => {
    it('User can send an invite to a non existing email', async () => {
      const user = await testData.createUser();
      const result = await invitesService.sendInvitations(
        user,
        new InvitationRequest({
          invites: [new MailInvite({ email: 'test@mail.de' })],
        }),
      );

      expect(result.length).toEqual(1);
      expect(result[0] instanceof MailInvitation).toEqual(true);
      expect((<MailInvitation>result[0]).email).toEqual('test@mail.de');
      expect(result[0].role).toBeUndefined();
      expect(result[0].pid).toBeUndefined();
      expect(result[0].token).toBeDefined();
      expect(result[0].createdBy).toEqual(user._id);
      expect(TestMailService.sentMailOptions.length).toEqual(1);
      expect(TestMailService.sentMailOptions[0].to).toEqual('test@mail.de');
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
      expect(result[0].role).toEqual(BaseProfileRelationRole.Member);
      expect(result[0].pid).toEqual(profile._id);
      expect(result[0].token).toBeDefined();
      expect(result[0].createdBy).toEqual(owner._id);
    });
  });
});