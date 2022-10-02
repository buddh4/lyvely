import { UserRegistrationDto } from '@/users';
import { validate } from 'class-validator';

describe('RegisterDto', () => {
  describe('validation', function () {
    it('initialization', async () => {
      const model = new UserRegistrationDto({
        username: 'MyUser',
        email: 'test@mail.de',
        locale: 'de',
        password: 'password',
      });

      expect(model.username).toEqual('MyUser');
      expect(model.email).toEqual('test@mail.de');
      expect(model.locale).toEqual('de');
      expect(model.password).toEqual('password');
    });

    it('validation succeeds', async () => {
      const model = new UserRegistrationDto({
        username: 'MyUser',
        email: 'test@mail.de',
        locale: 'de',
        password: 'password',
      });

      const errors = await validate(model);
      expect(errors.length).toEqual(0);
    });

    it('validation fails due to wrong email', async () => {
      const model = new UserRegistrationDto({
        username: 'MyUser',
        email: 'test@mail',
        locale: 'de',
        password: 'password',
      });

      const errors = await validate(model);
      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('email');
    });

    it('locale is optional', async () => {
      const model = new UserRegistrationDto({
        username: 'MyUser',
        email: 'test@mail.de',
        password: 'password',
      });

      const errors = await validate(model);
      expect(errors.length).toEqual(0);
    });

    it('validation fails due to short username', async () => {
      const model = new UserRegistrationDto({
        username: 'A',
        email: 'test@mail.de',
        locale: 'de',
        password: 'password',
      });

      const errors = await validate(model);
      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('username');
    });
  });
});
