import { UserRegistrationService } from './user-registration.service';
import {
  FieldValidationException,
  ForbiddenServiceException,
  UniqueConstraintException,
} from '@lyvely/common';
import { UserStatus, User, UsersService, UserTestDataUtils, usersTestPlugin } from '@lyvely/users';
import { VerifyEmailDto } from '@lyvely/user-accounts';
import { UserRegistration } from '@lyvely/user-registrations-interface';
import { TestConfigService, LyvelyTestingModule, buildTest } from '@lyvely/testing';
import { UserRegistrationModule } from '../user-registration.module';
import { ConfigService } from '@nestjs/config';
import {
  InvitationsModule,
  InvitationDao,
  MailInvitation,
  SendInvitationsService,
} from '@lyvely/user-invitations';
import { assureObjectId, EntityIdentity } from '@lyvely/core';
import { Profile } from '@lyvely/profiles';
import { UnauthorizedException } from '@nestjs/common';
import { contentTestPlugin } from '@lyvely/content';
import { mailTestPlugin } from '@lyvely/mails';
import { i18nTestPlugin } from '@lyvely/i18n';
import { otpTestPlugin } from '@lyvely/otp';
import { notificationTestPlugin } from '@lyvely/notifications';

describe('UserRegistrationService', () => {
  let testingModule: LyvelyTestingModule;
  let registerService: UserRegistrationService;
  let userService: UsersService;
  let testData: UserTestDataUtils;
  let configService: TestConfigService;
  let invitationDao: InvitationDao;
  let sendInvitationService: SendInvitationsService;

  const TEST_KEY = 'register_service';

  beforeEach(async () => {
    testingModule = await buildTest(TEST_KEY)
      .plugins([
        usersTestPlugin,
        otpTestPlugin,
        contentTestPlugin,
        notificationTestPlugin,
        mailTestPlugin,
        i18nTestPlugin,
      ])
      .imports([UserRegistrationModule, InvitationsModule])
      .compile();
    registerService = testingModule.get<UserRegistrationService>(UserRegistrationService);
    userService = testingModule.get(UsersService);
    testData = testingModule.get(UserTestDataUtils);
    configService = testingModule.get(ConfigService);
    invitationDao = testingModule.get(InvitationDao);
    sendInvitationService = testingModule.get(SendInvitationsService);
  });

  afterEach(async () => {
    return testingModule.afterEach();
  });

  afterAll(async () => {
    return testingModule.afterAll();
  });

  it('should be defined', () => {
    expect(registerService).toBeDefined();
  });

  const validRegistration = createUserRegistrationInstance();

  describe('register', () => {
    it('register valid user', async () => {
      await registerService.register(validRegistration);

      const user = await findUserByMail();
      expect(user).toBeDefined();
      expect(user instanceof User).toEqual(true);
      expect(user!.username).toEqual('Tester');
      expect(user!.email).toEqual('tester@test.de');
      expect(user!.locale).toEqual('de-DE');
      expect(user!.status).toEqual(UserStatus.EmailVerification);
    });

    it('register user with invalid email', async () => {
      expect.assertions(1);

      try {
        await registerService.register(
          new UserRegistration({
            username: 'Tester',
            email: 'testertest.de',
            password: 'testpw',
            locale: 'de',
          }),
        );
      } catch (err) {
        expect(err instanceof FieldValidationException).toEqual(true);
      }
    });

    it('register already existing email', async () => {
      expect.assertions(1);

      await registerService.register(validRegistration);

      try {
        await registerService.register(validRegistration);
      } catch (err) {
        expect(err instanceof UniqueConstraintException).toEqual(true);
      }
    });

    it('registration not allowed if registrationMode is none', async () => {
      expect.assertions(1);
      configService.set('userRegistration.mode', 'none');

      try {
        await registerService.register(validRegistration);
      } catch (e) {
        expect(e instanceof ForbiddenServiceException).toEqual(true);
      }
    });

    it('registration without invite token not allowed if registrationMode is invite', async () => {
      expect.assertions(1);
      configService.set('userRegistration.mode', 'invite');
      try {
        await registerService.register(validRegistration);
      } catch (e) {
        expect(e instanceof ForbiddenServiceException).toEqual(true);
      }
    });

    it('registration with invalid invite token not allowed if registrationMode is invite', async () => {
      expect.assertions(1);
      configService.set('userRegistration.mode', 'invite');

      try {
        await registerService.register(validRegistration);
      } catch (e) {
        expect(e instanceof ForbiddenServiceException).toEqual(true);
      }
    });

    it('registration with invalid invite token allowed if registrationMode is public', async () => {
      configService.set('userRegistration.mode', 'public');
      await registerService.register(validRegistration);
      const user = await findUserByMail();
      expect(user).toBeDefined();
    });

    it('registration with valid invite token confirms invitation', async () => {
      const user = await testData.createUser();
      const email = 'invitee@test.de';
      const invitation = await createMailInvitation(email, user);
      await registerService.register(
        createUserRegistrationInstance({ email, inviteToken: invitation.token }),
      );
      const updatedInvitation = await invitationDao.reload(invitation);
      const registeredUser = await findUserByMail(email);
      expect(registeredUser).toBeDefined();
      expect(updatedInvitation!.createdBy).toEqual(user._id);
      expect(updatedInvitation!.uid).toEqual(registeredUser!._id);
      expect(updatedInvitation!.token).toBeNull();
    });

    it('registration invalidates other invitations', async () => {
      const user = await testData.createUser();
      const user2 = await testData.createUser('user2');
      const email = 'invitee@test.de';
      const invitation = await createMailInvitation(email, user);
      const invitation2 = await createMailInvitation(email, user2);
      await registerService.register(
        createUserRegistrationInstance({ email, inviteToken: invitation.token }),
      );
      const updatedInvitation = await invitationDao.reload(invitation);
      const registeredUser = await findUserByMail(email);
      expect(registeredUser).toBeDefined();
      expect(updatedInvitation!.createdBy).toEqual(user._id);
      expect(updatedInvitation!.uid).toEqual(registeredUser!._id);
      expect(updatedInvitation!.token).toBeNull();
      const updatedInvitation2 = await invitationDao.reload(invitation2);
      expect(updatedInvitation2).toBeNull();
    });
  });

  describe('verifyEmail', () => {
    it('verify valid otp', async () => {
      await registerService.register(validRegistration);
      const { user } = await registerService.verifyEmail(
        new VerifyEmailDto({
          otp: '000000',
          email: validRegistration.email,
        }),
      );

      expect(user).toBeDefined();
      expect(user.status).toEqual(UserStatus.Active);
      expect(user.getVerifiedUserEmail(validRegistration.email)).toBeDefined();
    });

    it('verify invalid otp', async () => {
      expect.assertions(1);
      await registerService.register(validRegistration);
      try {
        await registerService.verifyEmail(
          new VerifyEmailDto({
            otp: '001111',
            email: validRegistration.email,
          }),
        );
      } catch (e) {
        expect(e instanceof UnauthorizedException).toEqual(true);
      }
    });
  });

  function createUserRegistrationInstance(raw: Partial<UserRegistration> = {}) {
    return new UserRegistration(
      Object.assign(
        {
          username: 'Tester',
          email: 'tester@test.de',
          password: 'testpw',
          remember: true,
          locale: 'de-DE',
        },
        raw,
      ),
    );
  }

  async function findUserByMail(email = 'tester@test.de') {
    return userService.findUserByMainEmail(email);
  }

  async function createMailInvitation(
    email: string,
    host: EntityIdentity<User>,
    pid?: EntityIdentity<Profile>,
  ) {
    return invitationDao.save(
      new MailInvitation({
        createdBy: assureObjectId(host),
        token: sendInvitationService.createMailInviteToken(email),
        email,
        pid: assureObjectId(pid, true),
      }),
    );
  }
});