import { getDefaultLocale, RefreshToken, User, UserDocument } from './index';
import { Model } from 'mongoose';
import { buildTest, LyvelyTestingModule } from '@/testing';
import { addDays } from '@lyvely/dates';
import { compare } from 'bcrypt';
import { usersTestPlugin, UserTestDataUtils } from '../testing';

describe('Users schema', () => {
  let testingModule: LyvelyTestingModule;
  let testData: UserTestDataUtils;
  let UserModel: Model<UserDocument>;

  const TEST_KEY = 'user_schema';

  beforeEach(async () => {
    testingModule = await buildTest(TEST_KEY).plugins([usersTestPlugin]).compile();
    testData = testingModule.get(UserTestDataUtils);
    UserModel = testingModule.get<Model<UserDocument>>('UserModel');
  });

  afterEach(async () => {
    return testingModule.afterEach();
  });

  afterAll(async () => {
    return testingModule.afterAll();
  });

  describe('create', () => {
    it('initial user data', async () => {
      const user = await UserModel.create(
        new User({
          username: 'Test',
          password: 'Password',
          email: 'Tester@test.de',
        }),
      );

      expect(user.username).toEqual('Test');
      expect(user.password).toBeDefined();
      expect(user.password).not.toEqual('Password');
      expect(user.email).toEqual('tester@test.de');
      expect(user.enabled).toEqual(true);
      expect(user.locale).toEqual(getDefaultLocale());

      expect(user.emails).toBeDefined();
      expect(user.emails[0].lowercaseEmail).toEqual(user.email);
      expect(user.emails[0].email).toEqual('Tester@test.de');
      expect(user.emails[0].verified).toEqual(false);
    });
  });

  describe('assure password is hashed on low level updates', () => {
    it('create', async () => {
      const user = await UserModel.create(
        new User({ username: 'Test', password: 'Password', email: 'Tester@test.de' }),
      );
      expect(user.password).not.toEqual('Password');
      const updated = await UserModel.findById(user._id);
      expect(updated!.password).not.toEqual('Password');
      expect(await compare('Password', updated!.password)).toEqual(true);
    });

    it('save', async () => {
      const user = await UserModel.create(
        new User({ username: 'Test', password: 'Password', email: 'Tester@test.de' }),
      );
      const oldPassword = user.password;
      user.password = 'newPassword';
      await user.save();

      const updated = await UserModel.findById(user._id);
      expect(updated!.password).not.toEqual(oldPassword);
      expect(updated!.password).not.toEqual('newPassword');
      expect(await compare('newPassword', updated!.password)).toEqual(true);
    });

    it('update', async () => {
      const user = await testData.createUser('test', { password: 'whatever' });
      const oldPassword = user.password;
      await UserModel.updateOne({ _id: user._id }, { password: 'newPassword' });
      const updated = await UserModel.findById(user._id);
      expect(updated!.password).not.toEqual(oldPassword);
      expect(updated!.password).not.toEqual('newPassword');
      expect(await compare('newPassword', updated!.password)).toEqual(true);
    });

    it('updateOne', async () => {
      const user = await testData.createUser('test', { password: 'whatever' });
      const oldPassword = user.password;
      await UserModel.updateOne({ _id: user._id }, { password: 'newPassword' });
      const updated = await UserModel.findById(user._id);
      expect(updated!.password).not.toEqual(oldPassword);
      expect(updated!.password).not.toEqual('newPassword');
      expect(await compare('newPassword', updated!.password)).toEqual(true);
    });

    it('updateOne with $set', async () => {
      const user = await testData.createUser('test', { password: 'whatever' });
      const oldPassword = user.password;
      await UserModel.updateOne({ _id: user._id }, { $set: { password: 'newPassword' } });
      const updated = await UserModel.findById(user._id);
      expect(updated!.password).not.toEqual(oldPassword);
      expect(updated!.password).not.toEqual('newPassword');
      expect(await compare('newPassword', updated!.password)).toEqual(true);
    });

    it('updateMany does not allow password set', async () => {
      const user = await testData.createUser('test', { password: 'whatever' });
      const oldPassword = user.password;
      await UserModel.updateMany({}, { password: 'newPassword' });
      const updated = await UserModel.findById(user._id);
      expect(updated!.password).toEqual(oldPassword);
      expect(updated!.password).not.toEqual('newPassword');
      expect(await compare('newPassword', updated!.password)).toEqual(false);
    });

    it('updateMany with $set does not allow password set', async () => {
      const user = await testData.createUser('test', { password: 'whatever' });
      const oldPassword = user.password;
      await UserModel.updateMany({}, { $set: { password: 'newPassword' } });
      const updated = await UserModel.findById(user._id);
      expect(updated!.password).toEqual(oldPassword);
      expect(updated!.password).not.toEqual('newPassword');
      expect(await compare('newPassword', updated!.password)).toEqual(false);
    });

    it('findOneAndUpdate', async () => {
      const user = await testData.createUser('test', { password: 'whatever' });
      const oldPassword = user.password;
      const updated = await UserModel.findOneAndUpdate(
        { _id: user._id },
        { password: 'newPassword' },
        { new: true },
      );
      expect(updated!.password).not.toEqual(oldPassword);
      expect(updated!.password).not.toEqual('newPassword');
      expect(await compare('newPassword', updated!.password)).toEqual(true);
    });

    it('replaceOne', async () => {
      const user = await testData.createUser('test', { password: 'whatever' });
      const oldPassword = user.password;
      await UserModel.replaceOne(
        { _id: user._id },
        new User({ username: 'Test', password: 'newPassword', email: 'Tester@test.de' }),
      );
      const updated = await UserModel.findById(user._id);
      expect(updated!.password).not.toEqual(oldPassword);
      expect(updated!.password).not.toEqual('newPassword');
      expect(await compare('newPassword', updated!.password)).toEqual(true);
    });

    it('findOneAndReplace', async () => {
      const user = await testData.createUser('test', { password: 'whatever' });
      const oldPassword = user.password;
      const updated = await UserModel.findOneAndReplace(
        { _id: user._id },
        new User({ username: 'Test', password: 'newPassword', email: 'Tester@test.de' }),
        { new: true },
      );
      expect(updated!.password).not.toEqual(oldPassword);
      expect(updated!.password).not.toEqual('newPassword');
      expect(await compare('newPassword', updated!.password)).toEqual(true);
    });
  });

  describe('toJSON', () => {
    it('make sure password is not exposed', async () => {
      const user = await UserModel.create(
        new User({
          username: 'Test',
          password: 'Password',
          email: 'Tester@test.de',
          refreshTokens: [
            new RefreshToken({
              vid: 'vid1',
              hash: 'someHash',
              expiration: addDays(new Date(), 1),
            }),
          ],
        }),
      );

      const json = user.toJSON();
      expect(json.password).toBeUndefined();
      expect(json.refreshTokens).toBeUndefined();
    });
  });
});
