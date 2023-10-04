import { UserRegistration } from './user.registration.model';
import { validate } from 'class-validator';

describe('RegisterDto', () => {
  describe('validation', function () {
    it('initialization', async () => {
      const model = new UserRegistration({
        username: 'MyUser',
        email: 'test@mail.de',
        locale: 'de',
        password: 'password',
        passwordRepeat: 'password',
      });

      expect(model.username).toEqual('MyUser');
      expect(model.email).toEqual('test@mail.de');
      expect(model.locale).toEqual('de');
      expect(model.password).toEqual('password');
    });

    it('validation succeeds', async () => {
      const model = new UserRegistration({
        username: 'MyUser',
        email: 'test@mail.de',
        locale: 'de',
        password: 'password',
        passwordRepeat: 'password',
      });

      const errors = await validate(model);
      expect(errors.length).toEqual(0);
    });

    it('validation fails due to wrong email', async () => {
      const model = new UserRegistration({
        username: 'MyUser',
        email: 'test@mail',
        locale: 'de',
        password: 'password',
        passwordRepeat: 'password',
      });

      const errors = await validate(model);
      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('email');
    });

    it('locale is optional', async () => {
      const model = new UserRegistration({
        username: 'MyUser',
        email: 'test@mail.de',
        password: 'password',
        passwordRepeat: 'password',
      });

      const errors = await validate(model);
      expect(errors.length).toEqual(0);
    });

    it('validation fails due to empty username', async () => {
      const model = new UserRegistration({
        username: '',
        email: 'test@mail.de',
        locale: 'de',
        password: 'password',
        passwordRepeat: 'password',
      });

      const errors = await validate(model);
      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('username');
    });
  });
});
