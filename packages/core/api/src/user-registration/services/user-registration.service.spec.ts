import { UserRegistrationService } from './user-registration.service';
import {
  FieldValidationException,
  ForbiddenServiceException,
  UserStatus,
  UserRegistration,
  VerifyEmailDto,
} from '@lyvely/interface';
import { User, UsersService, UserTestDataUtils } from '@/users';
import { TestConfigService, ILyvelyTestingModule } from '@/testing';
import { UserRegistrationModule } from '../user-registration.module';
import { ConfigService } from '@nestjs/config';
import {
  UserInvitationsModule,
  InvitationDao,
  MailInvitation,
  SendInvitationsService,
} from '@/user-invitations';
import { assureObjectId, DocumentIdentity } from '@/core';
import { Profile } from '@/profiles';
import { UnauthorizedException } from '@nestjs/common';
import { mailITestPlugin } from '@/mails';
import { i18nITestPlugin } from '@/i18n';
import { otpITestPlugin } from '@/otp';
import { notificationITestPlugin } from '@/notifications';
import { buildContentTest } from '@/content';

describe('UserRegistrationService', () => {
  let testingModule: ILyvelyTestingModule;
  let registerService: UserRegistrationService;
  let userService: UsersService;
  let testData: UserTestDataUtils;
  let configService: TestConfigService;
  let invitationDao: InvitationDao;
  let sendInvitationService: SendInvitationsService;

  const TEST_KEY = 'register_service';

  beforeEach(async () => {
    testingModule = await buildContentTest(TEST_KEY)
      .plugins([otpITestPlugin, notificationITestPlugin, mailITestPlugin, i18nITestPlugin])
      .imports([UserRegistrationModule, UserInvitationsModule])
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

  const validRegistration = createUserRegistrationInstance();

  describe('checkUserNameValidity', () => {
    it('valid username does not exist', async () => {
      expect(await registerService.validateUserName('test')).toEqual(true);
    });

    it('username does exist', async () => {
      await testData.createUser('test');

      try {
        await registerService.validateUserName('test');
      } catch (e) {
        expect(e instanceof FieldValidationException).toEqual(true);
        expect((<any>e).getFirstError()).toEqual('user-registration.username.taken');
      }
    });

    it('lowercase username does exist', async () => {
      await testData.createUser('test');

      try {
        await registerService.validateUserName('TEST');
      } catch (e) {
        expect(e instanceof FieldValidationException).toEqual(true);
        expect((<any>e).getFirstError()).toEqual('user-registration.username.taken');
      }
    });

    it('invalid username', async () => {
      try {
        await registerService.validateUserName('__test');
      } catch (e) {
        expect(e instanceof FieldValidationException).toEqual(true);
        expect((<any>e).getFirstError()).toEqual('user-registration.username.invalid');
      }
    });
  });

  describe('checkUserEmailValidity', () => {
    it('valid email does not exist', async () => {
      const result = await registerService.validateEmail('test@test.de');
      expect(result).toEqual(true);
    });

    it('email does exist', async () => {
      await testData.createUser('test');
      try {
        await registerService.validateEmail('test@test.de');
      } catch (e) {
        expect(e instanceof FieldValidationException).toEqual(true);
        expect((<any>e).getFirstError()).toEqual('user-registration.email.taken');
      }
    });

    it('lowercase email does exist', async () => {
      await testData.createUser('test');
      try {
        await registerService.validateEmail('TEST@TEST.de');
      } catch (e) {
        expect(e instanceof FieldValidationException).toEqual(true);
        expect((<any>e).getFirstError()).toEqual('user-registration.email.taken');
      }
    });

    it('username invalid', async () => {
      await testData.createUser('test');
      try {
        await registerService.validateEmail('test@');
      } catch (e) {
        expect(e instanceof FieldValidationException).toEqual(true);
        expect((<any>e).getFirstError()).toEqual('user-registration.email.invalid');
      }
    });
  });

  describe('register', () => {
    it('register valid user', async () => {
      await registerService.register(validRegistration);

      const user = await findUserByMail();
      expect(user).toBeDefined();
      expect(user instanceof User).toEqual(true);
      expect(user!.username).toEqual('Tester');
      expect(user!.email).toEqual('tester@test.de');
      expect(user!.locale).toEqual('de');
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
            passwordRepeat: 'testpw',
            timezone: 'Europe/Berlin',
          })
        );
      } catch (err) {
        expect(err instanceof FieldValidationException).toEqual(true);
      }
    });

    it('register already existing email', async () => {
      expect.assertions(1);

      await registerService.register(validRegistration);

      try {
        await registerService.register({ ...validRegistration, ...{ username: 'Another' } });
      } catch (err) {
        expect((<FieldValidationException>err).getFields()[0].property).toEqual('email');
      }
    });

    it('register already existing username', async () => {
      expect.assertions(1);

      const newRegistration = { ...validRegistration, ...{ email: 'another@test.de' } };

      await registerService.register(validRegistration);

      try {
        await registerService.register(validRegistration);
      } catch (err) {
        expect(err instanceof FieldValidationException).toEqual(true);
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
        createUserRegistrationInstance({ email, inviteToken: invitation.token })
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
        createUserRegistrationInstance({ email, inviteToken: invitation.token })
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
          emailOrUsername: validRegistration.email,
        })
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
            emailOrUsername: validRegistration.email,
          })
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
          locale: 'de',
          passwordRepeat: 'testpw',
          timezone: 'Europe/Berlin',
        },
        raw
      )
    );
  }

  async function findUserByMail(email = 'tester@test.de') {
    return userService.findUserByMainEmail(email);
  }

  async function createMailInvitation(
    email: string,
    host: DocumentIdentity<User>,
    pid?: DocumentIdentity<Profile>
  ) {
    return invitationDao.save(
      new MailInvitation({
        createdBy: assureObjectId(host),
        token: sendInvitationService.createMailInviteToken(email),
        email,
        pid: assureObjectId(pid, true),
      })
    );
  }
});
